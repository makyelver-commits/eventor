// Simple hash function using Web Crypto API (available in browser and Node.js)
export async function hashPassword(password: string): Promise<string> {
  try {
    // Convert password to Uint8Array
    const encoder = new TextEncoder()
    const data = encoder.encode(password)

    // Hash using SHA-256
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

    return hashHex
  } catch (error) {
    console.error("[v0] Error hashing password:", error)
    throw new Error("Error al procesar la contraseña")
  }
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const hash = await hashPassword(password)
    return hash === hashedPassword
  } catch (error) {
    console.error("[v0] Error verifying password:", error)
    return false
  }
}

export function generateResetToken(): string {
  // Generate a random token using crypto
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

export function generateResetExpiry(): Date {
  return new Date(Date.now() + 3600000) // 1 hour from now
}

export function isResetTokenValid(tokenExpiry: Date): boolean {
  return new Date() < tokenExpiry
}
