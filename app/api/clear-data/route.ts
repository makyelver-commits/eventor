import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(request: NextRequest) {
  try {
    // Borrar todos los eventos de la base de datos
    await db.event.deleteMany({})
    
    // Opcional: También podríamos borrar archivos subidos si fuera necesario
    // Por ahora solo borramos los eventos de la base de datos
    
    return NextResponse.json({ 
      message: 'Todos los datos han sido eliminados correctamente',
      deletedEvents: true
    })
  } catch (error) {
    console.error('Error clearing data:', error)
    return NextResponse.json(
      { error: 'No se pudieron eliminar los datos' },
      { status: 500 }
    )
  }
}
