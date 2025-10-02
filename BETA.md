# EVENTOR - Beta Version 🚀

## 📋 **Resumen de la Beta**

EVENTOR es una aplicación de calendario de eventos moderna y completa, desarrollada con Next.js 15, TypeScript y Tailwind CSS. Esta versión beta incluye todas las funcionalidades principales para una gestión de eventos profesional.

---

## ✅ **Funcionalidades Implementadas**

### 🎯 **Gestión de Eventos**
- ✅ **CRUD Completo**: Crear, leer, actualizar y eliminar eventos
- ✅ **Campos Rich**: Título, fecha, hora, ubicación, notas, imágenes
- ✅ **Sistema de Colores**: 5 colores predefinidos estilo Apple
- ✅ **Validaciones**: Formularios validados con feedback visual

### 📅 **Calendario Interactivo**
- ✅ **Vista Mensual**: Calendario completo con navegación
- ✅ **Eventos Visuales**: Los eventos se muestran en el calendario
- ✅ **Navegación**: Mes anterior/siguiente con animaciones
- ✅ **Días Destacados**: Eventos con colores en las fechas

### 🖼️ **Sistema de Imágenes**
- ✅ **Upload de Imágenes**: Soporte para flyers y fotos
- ✅ **Previsualización**: Miniaturas en eventos
- ✅ **Visor Completo**: Modal para ver imágenes a tamaño completo
- ✅ **Descarga**: Descargar imágenes individualmente

### 📄 **Exportación de Datos**
- ✅ **Exportación TXT**: Todos los eventos futuros en formato texto
- ✅ **Organización por Meses**: Estructura clara y legible
- ✅ **Metadatos Completos**: Fecha de creación, actualización, etc.
- ✅ **Estadísticas**: Resumen de eventos exportados

### 🎨 **Diseño y UX**
- ✅ **Logo Interactivo**: Recuadro negro con números 1-31 que cambian con clicks
- ✅ **Branding**: "Calendario de eventos by MakyForce"
- ✅ **Diseño Responsive**: Mobile-first, funciona en todos los dispositivos
- ✅ **Tema Oscuro**: Interfaz moderna y elegante
- ✅ **Animaciones**: Transiciones suaves y micro-interacciones

### 🔐 **Autenticación**
- ✅ **Registro/Login**: Sistema completo de autenticación
- ✅ **Acceso Directo**: Opción para acceder sin registro
- ✅ **Estados de Carga**: Indicadores visuales durante procesos

---

## 🛠 **Stack Tecnológico**

### **Core Framework**
- **Next.js 15** con App Router
- **TypeScript 5** para tipado seguro
- **Tailwind CSS 4** para estilos

### **Base de Datos**
- **Prisma ORM** con SQLite
- **Migraciones automáticas**
- **Consultas optimizadas**

### **UI Components**
- **shadcn/ui** component library
- **Lucide React** icons
- **Toast notifications**

### **Backend**
- **API Routes** RESTful
- **File Upload** system
- **Error handling** robusto

---

## 📁 **Estructura del Proyecto**

\`\`\`
src/
├── app/
│   ├── api/
│   │   ├── events/          # CRUD de eventos
│   │   ├── upload/          # Upload de imágenes
│   │   └── user-settings/   # Configuración usuario
│   └── page.tsx             # Página principal
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   ├── calendar-app.tsx     # Componente principal
│   ├── eventor-logo.tsx     # Logo interactivo
│   ├── auth-guard.tsx       # Protección de rutas
│   └── auth-page.tsx        # Página de login
├── contexts/
│   └── auth-context.tsx     # Contexto de autenticación
└── lib/
    ├── db.ts                # Cliente Prisma
    └── socket.ts            # WebSockets (futuro)
\`\`\`

---

## 🚀 **Cómo Usar**

### **1. Iniciar la Aplicación**
\`\`\`bash
npm run dev
\`\`\`
La aplicación estará disponible en `http://localhost:3000`

### **2. Flujo de Usuario**
1. **Login/Registro**: Acceder con email o crear cuenta
2. **Acceso Directo**: Opción para usar sin registro
3. **Crear Eventos**: Click en cualquier día del calendario
4. **Gestionar Eventos**: Editar o eliminar eventos existentes
5. **Exportar Datos**: Descargar todos los eventos futuros en TXT

### **3. Funcionalidades Principales**
- **Click en calendario**: Abre formulario para nuevo evento
- **Click en evento**: Muestra detalles y opciones de edición
- **Logo interactivo**: Cambia números con cada click
- **Exportación TXT**: Descarga todos los eventos futuros

---

## 🎯 **Características Destacadas**

### **Logo Interactivo**
- Recuadro negro elegante
- Números del 1 al 31 que rotan con cada click
- Efectos visuales y animaciones fluidas
- Branding "MakyForce" integrado

### **Exportación Inteligente**
- Solo eventos futuros desde hoy
- Organización automática por meses
- Estadísticas detalladas
- Formato legible y profesional

### **Diseño Premium**
- Inspiración en el ecosistema Apple
- Colores vibrantes y modernos
- Transiciones suaves
- Totalmente responsive

---

## 📊 **Estado de la Beta**

### **✅ Completado**
- Todas las funcionalidades principales
- Sistema de eventos completo
- Exportación de datos
- Diseño responsive
- Autenticación funcional

### **🔄 Mejoras Futuras**
- Notificaciones push
- Sincronización con calendarios externos
- Modo colaboración
- Analytics y reportes
- Tema claro/oscuro

---

## 🛡 **Calidad del Código**

- ✅ **TypeScript estricto**
- ✅ **ESLint sin errores**
- ✅ **Componentes reutilizables**
- ✅ ** Manejo de errores robusto**
- ✅ **Performance optimizada**

---

## 📞 **Soporte**

**Desarrollado por**: MakyForce  
**Versión**: Beta 1.0  
**Estado**: Listo para testing de usuarios

---

## 🎉 **¡Listo para Usar!**

Esta beta está completamente funcional y lista para ser utilizada. Todas las características principales han sido implementadas y probadas. Disfruta de tu nuevo gestor de eventos EVENTOR!
