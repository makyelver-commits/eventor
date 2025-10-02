import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateResetToken, generateResetExpiry } from '@/lib/auth'
import ZAI from 'z-ai-web-dev-sdk'

async function sendRecoveryEmail(email: string, resetToken: string) {
  try {
    const zai = await ZAI.create()
    
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    
    const emailContent = {
      to: email,
      subject: 'EVENTOR - Recuperación de Contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a0a; color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00ff88; font-size: 2.5em; margin-bottom: 10px; text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);">EVENTOR</h1>
            <p style="color: #888; font-size: 1.1em;">Recuperación de Contraseña</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #1a1a1a, #2a2a2a); padding: 30px; border-radius: 15px; border: 1px solid #333; margin-bottom: 20px;">
            <h2 style="color: #00ff88; margin-bottom: 20px; font-size: 1.5em;">Hola,</h2>
            <p style="color: #ccc; line-height: 1.6; margin-bottom: 20px;">
              Has solicitado restablecer tu contraseña en EVENTOR. Para continuar, haz clic en el siguiente enlace:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="display: inline-block; background: linear-gradient(45deg, #00ff88, #00cc6a); 
                        color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; 
                        font-weight: bold; font-size: 1.1em; text-transform: uppercase; 
                        letter-spacing: 1px; box-shadow: 0 4px 15px rgba(0, 255, 136, 0.3);
                        transition: all 0.3s ease;">
                Restablecer Contraseña
              </a>
            </div>
            
            <p style="color: #888; font-size: 0.9em; line-height: 1.5;">
              O copia y pega este enlace en tu navegador:<br>
              <span style="word-break: break-all; color: #00ff88;">${resetLink}</span>
            </p>
          </div>
          
          <div style="background: #1a1a1a; padding: 20px; border-radius: 10px; border: 1px solid #333;">
            <h3 style="color: #ff6b6b; margin-bottom: 15px; font-size: 1.2em;">⚠️ Información Importante:</h3>
            <ul style="color: #ccc; line-height: 1.6; padding-left: 20px;">
              <li>Este enlace expirará en 1 hora por seguridad</li>
              <li>Si no solicitaste restablecer tu contraseña, ignora este email</li>
              <li>No compartas este enlace con nadie</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #666; font-size: 0.9em;">
              ¿Necesitas ayuda? Contacta a nuestro equipo de soporte
            </p>
            <p style="color: #00ff88; font-size: 0.8em; margin-top: 10px;">
              © 2024 EVENTOR - Todos los derechos reservados
            </p>
          </div>
        </div>
      `
    }
    
    // Simulate email sending (in production, you would use a real email service)
    console.log('Email would be sent with content:', emailContent)
    console.log('Reset link would be:', `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`)
    
    return true
  } catch (error) {
    console.error('Error sending recovery email:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email }
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: 'Si el email está registrado, recibirás un enlace de recuperación'
      })
    }

    // Generate reset token
    const resetToken = generateResetToken()
    const resetTokenExpiry = generateResetExpiry()

    // Update user with reset token
    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // Send recovery email
    const emailSent = await sendRecoveryEmail(email, resetToken)
    
    if (!emailSent) {
      console.error('Failed to send recovery email, but continuing for security')
    }

    return NextResponse.json({
      message: 'Si el email está registrado, recibirás un enlace de recuperación',
      // Include debug info in development
      debugInfo: process.env.NODE_ENV === 'development' ? {
        token: resetToken,
        resetLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`,
        emailSent
      } : undefined
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Error al procesar solicitud' },
      { status: 500 }
    )
  }
}
