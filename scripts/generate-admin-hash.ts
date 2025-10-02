// Script para generar el hash correcto de la contraseña del admin
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

async function main() {
  const password = "admin123"
  const hash = await hashPassword(password)

  console.log("=".repeat(60))
  console.log("HASH DE CONTRASEÑA GENERADO")
  console.log("=".repeat(60))
  console.log(`Contraseña: ${password}`)
  console.log(`Hash SHA-256: ${hash}`)
  console.log("=".repeat(60))
  console.log("\nCredenciales de administrador:")
  console.log("Email: admin@makyforce.com")
  console.log("Contraseña: admin123")
  console.log("=".repeat(60))
}

main()
