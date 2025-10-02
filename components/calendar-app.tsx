"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  MapPin,
  Clock,
  Trash2,
  Edit,
  RotateCcw,
  AlertTriangle,
  LogOut,
  User,
  Settings,
  Palette,
  Save,
  ChevronDown,
  Download,
  Maximize2,
  FileText,
  UserCircle,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import EnhancedBackground from "@/components/enhanced-background"
import EventorLogo from "@/components/eventor-logo"
import { Toaster } from "@/components/ui/toaster"

interface Event {
  id: string
  title: string
  date: string
  time: string
  location?: string
  color: string
  imageUrl?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface UserSettings {
  id?: string
  eventColors: Array<{ name: string; color: string }>
}

interface UserProfile {
  profileName?: string
  profileImage?: string
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  events: Event[]
}

export default function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedEventForView, setSelectedEventForView] = useState<Event | null>(null)
  const [isEventViewOpen, setIsEventViewOpen] = useState(false)
  const [isFullImageOpen, setIsFullImageOpen] = useState(false)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isMotivationalOpen, setIsMotivationalOpen] = useState(false)
  const [motivationalMessage, setMotivationalMessage] = useState({ title: "", message: "" })
  const [reminderInterval, setReminderInterval] = useState<NodeJS.Timeout | null>(null)
  const [todayEvents, setTodayEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "20:00",
    location: "",
    color: "#007AFF",
    notes: "",
    imageUrl: "",
  })
  const [userSettings, setUserSettings] = useState<UserSettings>({
    eventColors: [
      { name: "Concierto", color: "#007AFF" }, // Azul para conciertos
      { name: "Ensayo", color: "#34C759" }, // Verde para ensayos
      { name: "Estudio", color: "#FF9500" }, // Naranja para grabaciones
      { name: "Festival", color: "#FF3B30" }, // Rojo para festivales
      { name: "Privado", color: "#AF52DE" }, // Morado para eventos privados
    ],
  })
  const [userProfile, setUserProfile] = useState<UserProfile>({})
  const { toast } = useToast()
  const { user, logout } = useAuth()

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
  const weekDaysAbbr = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] // Abreviados para mostrar en cada recuadro

  // Función para generar degradado entre múltiples colores
  const generateGradient = (colors: string[]) => {
    if (colors.length === 0) return undefined
    if (colors.length === 1) return `linear-gradient(135deg, ${colors[0]}, ${colors[0]}dd, ${colors[0]}99)`

    // Crear un degradado más dinámico con múltiples colores
    const gradientColors: string[] = []
    const maxColors = Math.min(colors.length, 5) // Limitar a 5 colores máximo

    for (let i = 0; i < maxColors; i++) {
      const color = colors[i]
      const opacity = 1 - i * 0.12 // Reducir opacidad gradualmente
      const hexOpacity = Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0")

      // Añadir variaciones del mismo color
      gradientColors.push(`${color}${hexOpacity}`)
      if (i < maxColors - 1) {
        gradientColors.push(
          `${color}${Math.round(opacity * 0.8 * 255)
            .toString(16)
            .padStart(2, "0")}`,
        )
      }
    }

    // Generar degradado lineal con ángulo dinámico basado en cantidad de colores
    const angle = 135 + maxColors * 15 // Ángulo entre 135° y 210°
    return `linear-gradient(${angle}deg, ${gradientColors.join(", ")})`
  }

  // Función para generar sombra basada en múltiples colores
  const generateShadow = (colors: string[]) => {
    if (colors.length === 0) return undefined
    if (colors.length === 1)
      return `0 10px 25px -5px ${colors[0]}40, 0 10px 10px -5px ${colors[0]}20, inset 0 0 20px ${colors[0]}20`

    // Crear sombras múltiples para cada color con diferentes profundidades
    const shadows: string[] = []
    const maxColors = Math.min(colors.length, 4) // Limitar a 4 colores máximo

    for (let i = 0; i < maxColors; i++) {
      const color = colors[i]
      const intensity = Math.max(15, 40 - i * 12) // Intensidad entre 15 y 40
      const hexIntensity = intensity.toString(16)
      const offsetX = i * 2
      const offsetY = 10 + i * 3
      const blur = 25 - i * 4
      const spread = -5 + i * 2

      shadows.push(`${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}${hexIntensity}`)
    }

    // Añadir sombra interior
    shadows.push(`inset 0 0 ${15 + maxColors * 3}px ${colors[0]}20`)

    return shadows.join(", ")
  }

  // Función para generar efecto de brillo basado en múltiples colores
  const generateGlow = (colors: string[]) => {
    if (colors.length === 0) return undefined
    if (colors.length === 1) return `radial-gradient(circle at 50% 50%, ${colors[0]}40, transparent 70%)`

    // Crear múltiples efectos de brillo con diferentes posiciones
    const glows: string[] = []
    const maxColors = Math.min(colors.length, 3) // Limitar a 3 colores máximo

    for (let i = 0; i < maxColors; i++) {
      const color = colors[i]
      const intensity = Math.max(20, 40 - i * 10) // Intensidad entre 20 y 40
      const hexIntensity = intensity.toString(16)

      // Posiciones dinámicas para crear efecto más orgánico
      const positions = ["50% 50%", "30% 30%", "70% 70%", "30% 70%", "70% 30%"]
      const position = positions[i % positions.length]

      glows.push(`radial-gradient(circle at ${position}, ${color}${hexIntensity}, transparent 60%)`)
    }

    return glows.join(", ")
  }

  const getGuestEvents = (): Event[] => {
    if (typeof window === "undefined") return []
    try {
      const stored = localStorage.getItem("eventor-guest-events")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  const saveGuestEvents = (events: Event[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("eventor-guest-events", JSON.stringify(events))
  }

  // Fetch events from API
  const fetchEvents = async () => {
    // Check if user is in guest mode
    if (user?.isGuest) {
      // Load events from localStorage for guest users
      const guestEvents = getGuestEvents()
      setEvents(guestEvents)
      return
    }

    // Regular user - fetch from API
    const userId = user?.id
    if (!userId) return

    try {
      const response = await fetch(`/api/events?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos",
        variant: "destructive",
      })
    }
  }

  // Fetch user settings
  const fetchUserSettings = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/user-settings?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        // Parse event colors from JSON string
        const eventColors = typeof data.eventColors === "string" ? JSON.parse(data.eventColors) : data.eventColors

        setUserSettings({
          eventColors,
        })
      }
    } catch (error) {
      // Silently fail for user settings
    }
  }

  const fetchUserProfile = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/user/profile?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data)
      }
    } catch (error) {
      // Silently fail for user profile
    }
  }

  useEffect(() => {
    if (user) {
      fetchEvents()
      fetchUserSettings()
      fetchUserProfile()
    }
  }, [user])

  // Efecto para forzar actualización cuando cambian los eventos
  useEffect(() => {
    // Forzar re-renderizado cuando los eventos cambian
    const timer = setTimeout(() => {
      // Esto fuerza una actualización del componente
    }, 100)
    return () => clearTimeout(timer)
  }, [events])

  // Efecto para actualizar cuando cambia el mes
  useEffect(() => {
    fetchEvents()
  }, [currentDate])

  // Efecto para verificar eventos de hoy y configurar recordatorios
  useEffect(() => {
    checkTodayEvents()
  }, [events])

  // Efecto para limpiar recordatorios al desmontar
  useEffect(() => {
    return () => {
      clearReminders()
    }
  }, [])

  // Función para manejar fechas de forma segura (evitando problemas de zona horaria)
  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const parseLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number)
    return new Date(year, month - 1, day)
  }

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    const startingDayOfWeek = firstDay.getDay()

    const days: CalendarDay[] = []

    // Días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i)
      days.push({
        date,
        isCurrentMonth: false,
        events: events.filter((event) => {
          const eventDate = parseLocalDate(event.date)
          return (
            eventDate.getDate() === date.getDate() &&
            eventDate.getMonth() === date.getMonth() &&
            eventDate.getFullYear() === date.getFullYear()
          )
        }),
      })
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({
        date,
        isCurrentMonth: true,
        events: events.filter((event) => {
          const eventDate = parseLocalDate(event.date)
          return (
            eventDate.getDate() === date.getDate() &&
            eventDate.getMonth() === date.getMonth() &&
            eventDate.getFullYear() === date.getFullYear()
          )
        }),
      })
    }

    // Días del mes siguiente
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push({
        date,
        isCurrentMonth: false,
        events: events.filter((event) => {
          const eventDate = parseLocalDate(event.date)
          return (
            eventDate.getDate() === date.getDate() &&
            eventDate.getMonth() === date.getMonth() &&
            eventDate.getFullYear() === date.getFullYear()
          )
        }),
      })
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleViewEvent = (event: Event) => {
    setSelectedEventForView(event)
    setIsEventViewOpen(true)
  }

  const handleEventDoubleClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation()
    handleViewEvent(event)
  }

  const handleEventLongPress = (event: Event) => {
    handleViewEvent(event)
  }

  // Función para generar mensajes motivacionales para músicos/artistas
  const generateMotivationalMessage = (eventsCount: number, day: CalendarDay) => {
    const messages = {
      single: [
        { title: "🎵 ¡Hoy tocas!", message: "Un evento, una oportunidad de brillar. ¡Haz que cuente!" },
        { title: "🎸 Rockea hoy", message: "Tu escenario te espera. ¡Siente la música y vive el momento!" },
        { title: "🎤 Tu voz resuena", message: "Hoy eres la estrella. ¡Deja tu huella musical!" },
        { title: "🎹 Toca el alma", message: "Una presentación, mil emociones. ¡Conecta con tu audiencia!" },
        { title: "🥁 Ritmo interior", message: "Hoy tu pulso marca el ritmo. ¡Sé la banda sonora del día!" },
      ],
      multiple: [
        {
          title: "🎶 Día de estrella",
          message: `${eventsCount} eventos, ${eventsCount} oportunidades de brillar. ¡Hoy eres leyenda!`,
        },
        {
          title: "🎭 Multi-talento",
          message: `${eventsCount} escenarios, un solo artista. ¡Demuestra tu versatilidad!`,
        },
        {
          title: "🎪 Espectáculo completo",
          message: `${eventsCount} momentos mágicos te esperan. ¡El show debe continuar!`,
        },
        { title: "🎨 Artista en acción", message: `${eventsCount} lienzos sonoros por pintar. ¡Crea tu obra maestra!` },
        { title: "🌟 Estrella del día", message: `${eventsCount} aplausos, un solo corazón. ¡Ilumina cada escenario!` },
      ],
    }

    const messageArray = eventsCount === 1 ? messages.single : messages.multiple
    const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)]

    return randomMessage
  }

  // Función para verificar eventos de hoy y configurar recordatorios
  const checkTodayEvents = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Inicio del día

    const eventsToday = events.filter((event) => {
      const eventDate = new Date(event.date)
      eventDate.setHours(0, 0, 0, 0)
      return eventDate.getTime() === today.getTime()
    })

    setTodayEvents(eventsToday)

    // Si hay eventos hoy, configurar recordatorios
    if (eventsToday.length > 0) {
      setupReminders(eventsToday)
    } else {
      clearReminders()
    }
  }

  // Función para configurar recordatorios cada 3 minutos
  const setupReminders = (events: Event[]) => {
    // Limpiar recordatorios existentes
    clearReminders()

    // Mostrar recordatorio inmediato
    showMotivationalReminder(events)

    // Configurar recordatorios cada 3 minutos
    const interval = setInterval(
      () => {
        showMotivationalReminder(events)
      },
      3 * 60 * 1000,
    ) // 3 minutos en milisegundos

    setReminderInterval(interval)
  }

  // Función para limpiar recordatorios
  const clearReminders = () => {
    if (reminderInterval) {
      clearInterval(reminderInterval)
      setReminderInterval(null)
    }
  }

  // Función para mostrar recordatorio motivacional
  const showMotivationalReminder = (events: Event[]) => {
    const motivational = generateMotivationalMessage(events.length, {
      date: new Date(),
      events,
      isCurrentMonth: true,
    })
    setMotivationalMessage(motivational)
    setIsMotivationalOpen(true)
  }

  // Funciones para manejar la creación de eventos al hacer clic en fechas
  const handleDayClick = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return

    // Verificar si es hoy y tiene eventos
    const today = new Date()
    const isToday =
      day.date.getDate() === today.getDate() &&
      day.date.getMonth() === today.getMonth() &&
      day.date.getFullYear() === today.getFullYear()

    if (isToday && day.events.length > 0) {
      // Mostrar mensaje motivacional
      const motivational = generateMotivationalMessage(day.events.length, day)
      setMotivationalMessage(motivational)
      setIsMotivationalOpen(true)
      return
    }

    setSelectedDate(day.date)
    setEditingEvent(null)

    // Formatear fecha correctamente evitando problemas de zona horaria
    const formattedDate = formatDateForAPI(day.date)

    setFormData({
      title: "",
      date: formattedDate,
      time: "20:00",
      location: "",
      color: userSettings.eventColors[0]?.color || "#007AFF",
      notes: "",
      imageUrl: "",
    })
    setIsEventDialogOpen(true)
  }

  const handleDayDoubleClick = (day: CalendarDay) => {
    handleDayClick(day)
  }

  const handleDayLongPress = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return
    handleDayClick(day)
  }

  const handleViewFullImage = () => {
    setIsFullImageOpen(true)
  }

  const handleDownloadImage = async () => {
    if (!selectedEventForView?.imageUrl) return

    try {
      const response = await fetch(selectedEventForView.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${selectedEventForView.title.replace(/[^a-z0-9]/gi, "_")}_flyer.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Imagen descargada",
        description: "El flyer ha sido descargado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo descargar la imagen",
        variant: "destructive",
      })
    }
  }

  const handleDownloadEventsTXT = () => {
    // Filtrar eventos desde hoy en adelante
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Inicio del día actual

    const futureEvents = events
      .filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate >= today
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    if (futureEvents.length === 0) {
      toast({
        title: "Sin eventos",
        description: "No hay shows agendados para descargar",
        variant: "destructive",
      })
      return
    }

    try {
      // Crear el contenido del TXT
      let content = `TODOS TUS SHOWS AGENDADOS\n`
      content += `Generado: ${new Date().toLocaleString("es-MX")}\n`
      content += `${"=".repeat(60)}\n\n`

      // Agrupar eventos por mes y año
      const eventsByMonth: { [key: string]: Event[] } = {}
      futureEvents.forEach((event) => {
        const eventDate = new Date(event.date)
        const monthKey = `${monthNames[eventDate.getMonth()]} ${eventDate.getFullYear()}`
        if (!eventsByMonth[monthKey]) {
          eventsByMonth[monthKey] = []
        }
        eventsByMonth[monthKey].push(event)
      })

      // Ordenar meses cronológicamente y generar contenido
      const sortedMonths = Object.keys(eventsByMonth).sort((a, b) => {
        const dateA = new Date(a)
        const dateB = new Date(b)
        return dateA.getTime() - dateB.getTime()
      })

      sortedMonths.forEach((month) => {
        content += `📅 ${month.toUpperCase()}\n`
        content += `${"-".repeat(40)}\n`

        // Agrupar eventos por fecha dentro del mes
        const eventsByDate: { [key: string]: Event[] } = {}
        eventsByMonth[month].forEach((event) => {
          const dateKey = new Date(event.date).toLocaleDateString("es-MX")
          if (!eventsByDate[dateKey]) {
            eventsByDate[dateKey] = []
          }
          eventsByDate[dateKey].push(event)
        })

        // Ordenar fechas y generar contenido del mes
        Object.keys(eventsByDate)
          .sort((a, b) => {
            return new Date(a).getTime() - new Date(b).getTime()
          })
          .forEach((date) => {
            content += `\n📆 ${date}\n`
            content += `${"·".repeat(35)}\n`

            eventsByDate[date].forEach((event, index) => {
              content += `\n${index + 1}. ${event.title.toUpperCase()}\n`
              content += `   🕐 Hora: ${event.time}\n`

              if (event.location) {
                content += `   📍 Ubicación: ${event.location}\n`
              }

              if (event.notes) {
                content += `   📝 Notas: ${event.notes}\n`
              }

              if (event.imageUrl) {
                content += `   🖼️ Imagen: ${event.imageUrl}\n`
              }

              content += `   🎨 Color: ${event.color}\n`
              content += `   📆 Creado: ${new Date(event.createdAt).toLocaleString("es-MX")}\n`

              if (event.updatedAt !== event.createdAt) {
                content += `   ✏️ Actualizado: ${new Date(event.updatedAt).toLocaleString("es-MX")}\n`
              }

              content += `\n`
            })
          })

        content += `\n${"=".repeat(60)}\n\n`
      })

      // Estadísticas finales
      content += `📊 ESTADÍSTICAS FINALES\n`
      content += `${"-".repeat(30)}\n`
      content += `Total de shows agendados: ${futureEvents.length}\n`
      content += `Cantidad de meses: ${sortedMonths.length}\n`
      content += `Primer evento: ${new Date(futureEvents[0].date).toLocaleDateString("es-MX")}\n`
      content += `Último evento: ${new Date(futureEvents[futureEvents.length - 1].date).toLocaleDateString("es-MX")}\n`
      content += `Generado: ${new Date().toLocaleString("es-MX")}\n`
      content += `\n${"=".repeat(60)}\n`
      content += `EVENTOR - Tu Gestor de Eventos\n`

      // Crear y descargar el archivo
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      const todayStr = new Date().toISOString().split("T")[0]
      link.download = `Eventos_Completos_Desde_${todayStr}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Shows descargados",
        description: `Se han descargado ${futureEvents.length} shows en formato TXT`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron descargar los eventos",
        variant: "destructive",
      })
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!user) return

    // Guest mode - delete from localStorage
    if (user.isGuest) {
      const guestEvents = getGuestEvents()
      const updatedEvents = guestEvents.filter((e) => e.id !== eventId)
      saveGuestEvents(updatedEvents)
      setEvents(updatedEvents)
      toast({
        title: "Evento eliminado",
        description: "El evento ha sido eliminado (solo en esta sesión)",
      })
      return
    }

    // Regular user - delete from API
    setIsLoading(true)
    try {
      const response = await fetch(`/api/events/${eventId}?userId=${user.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchEvents()
        toast({
          title: "Evento eliminado",
          description: "El evento ha sido eliminado correctamente",
        })
      } else {
        throw new Error("Failed to delete event")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el evento",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location || "",
      color: event.color,
      notes: event.notes || "",
      imageUrl: event.imageUrl || "",
    })
    setIsEventDialogOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar que sea una imagen
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido",
        variant: "destructive",
      })
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no debe superar los 5MB",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Convert image to data URL for storage
      const reader = new FileReader()
      reader.onloadend = () => {
        const dataUrl = reader.result as string
        setFormData((prev) => ({ ...prev, imageUrl: dataUrl }))
        toast({
          title: "✅ Flyer subido",
          description: "El flyer se ha subido correctamente",
        })
        setIsLoading(false)
      }
      reader.onerror = () => {
        toast({
          title: "❌ Error al subir",
          description: "No se pudo leer el archivo. Intenta de nuevo.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "❌ Error al subir",
        description: "No se pudo subir el flyer. Intenta de nuevo.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.title.trim()) return

    setIsLoading(true)

    // Guest mode - save to localStorage
    if (user.isGuest) {
      try {
        const guestEvents = getGuestEvents()

        if (editingEvent) {
          // Update existing event
          const updatedEvents = guestEvents.map((e) =>
            e.id === editingEvent.id
              ? {
                  ...formData,
                  id: editingEvent.id,
                  createdAt: editingEvent.createdAt,
                  updatedAt: new Date().toISOString(),
                }
              : e,
          )
          saveGuestEvents(updatedEvents)
          setEvents(updatedEvents)
        } else {
          // Create new event
          const newEvent: Event = {
            ...formData,
            id: `guest-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          const updatedEvents = [...guestEvents, newEvent]
          saveGuestEvents(updatedEvents)
          setEvents(updatedEvents)
        }

        setIsEventDialogOpen(false)
        setFormData({
          title: "",
          date: "",
          time: "20:00",
          location: "",
          color: userSettings.eventColors[0]?.color || "#007AFF",
          notes: "",
          imageUrl: "",
        })
        setEditingEvent(null)
        const fileInput = document.getElementById("imageFile") as HTMLInputElement
        if (fileInput) fileInput.value = ""

        toast({
          title: editingEvent ? "Show actualizado" : "Show agendado",
          description: "Recuerda: Los datos del modo invitado no se guardarán al salir",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo guardar el evento",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
      return
    }

    // Regular user - save to API
    try {
      const eventData = {
        ...formData,
        userId: user.id,
      }

      let response
      if (editingEvent) {
        // Actualizar evento existente
        response = await fetch(`/api/events/${editingEvent.id}?userId=${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        })
      } else {
        // Crear nuevo evento
        response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        })
      }

      if (response.ok) {
        await fetchEvents()
        setIsEventDialogOpen(false)
        setFormData({
          title: "",
          date: "",
          time: "20:00",
          location: "",
          color: userSettings.eventColors[0]?.color || "#007AFF",
          notes: "",
          imageUrl: "",
        })
        setEditingEvent(null)
        // Limpiar el input de archivo
        const fileInput = document.getElementById("imageFile") as HTMLInputElement
        if (fileInput) fileInput.value = ""
        toast({
          title: editingEvent ? "Show actualizado" : "Show agendado",
          description: editingEvent
            ? "El show ha sido actualizado correctamente"
            : "El show ha sido agendado correctamente",
        })
      } else {
        throw new Error("Failed to save event")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el evento",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearAllData = async () => {
    setIsClearing(true)
    try {
      const response = await fetch("/api/clear-data", {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchEvents()
        setIsClearDialogOpen(false)
        toast({
          title: "Datos eliminados",
          description: "Todos los eventos han sido eliminados correctamente",
        })
      } else {
        throw new Error("Failed to clear data")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron eliminar los datos",
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  const handleSaveAllSettings = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      console.log("[v0] Saving all settings...")

      // Guardar configuración de colores
      console.log("[v0] Saving event colors...")
      const settingsResponse = await fetch("/api/user-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventColors: JSON.stringify(userSettings.eventColors),
          userId: user.id,
        }),
      })

      console.log("[v0] Settings response status:", settingsResponse.status)
      if (!settingsResponse.ok) {
        const errorData = await settingsResponse.json()
        console.error("[v0] Settings save failed:", errorData)
      }

      // Guardar perfil (solo la imagen de perfil, ya que el nombre no se puede modificar)
      console.log("[v0] Saving profile...")
      const profileResponse = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...userProfile,
          userId: user.id,
        }),
      })

      console.log("[v0] Profile response status:", profileResponse.status)
      if (!profileResponse.ok) {
        const errorData = await profileResponse.json()
        console.error("[v0] Profile save failed:", errorData)
      }

      if (settingsResponse.ok && profileResponse.ok) {
        console.log("[v0] All settings saved successfully")
        setIsSettingsOpen(false)
        toast({
          title: "Configuración guardada",
          description: "Tu configuración se ha guardado correctamente.",
        })
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return

    const file = e.target.files[0]
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("userId", user.id)

      const response = await fetch("/api/user/profile-image", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setUserProfile((prev) => ({ ...prev, profileImage: data.imageUrl }))
        await fetchUserProfile()
        toast({
          title: "Foto subida",
          description: "Tu foto de perfil se ha actualizado correctamente.",
        })
      } else {
        throw new Error("Failed to upload image")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo subir la foto de perfil",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getEventsForCurrentMonth = () => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear()
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const days = generateCalendarDays()
  const currentMonthEvents = getEventsForCurrentMonth()

  return (
    <div className="min-h-screen relative">
      <EnhancedBackground />
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 relative">
            <div className="flex justify-center mb-4">
              <EventorLogo size="xl" />
            </div>

            {user?.isGuest && (
              <div className="mb-4 mx-auto max-w-2xl">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-3">
                  <Info className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-left">
                    <p className="text-sm text-yellow-200 font-medium">Modo Invitado Activo</p>
                    <p className="text-xs text-yellow-300/80 mt-1">
                      Tus eventos solo se guardarán en esta sesión. Crea una cuenta para guardar permanentemente.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* User Actions */}
            <div className="absolute top-0 right-0 flex items-center gap-2">
              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-800/60 backdrop-blur-sm border-gray-600/60 text-gray-300 hover:bg-gray-700/80 hover:text-white transition-all duration-200 flex items-center gap-2"
                  >
                    {user?.isGuest ? <UserCircle className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    <span className="hidden sm:inline">{user?.isGuest ? "Invitado" : user?.name || user?.email}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white min-w-[200px]">
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer">
                    {user?.isGuest ? <UserCircle className="h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
                    <span className="text-sm">{user?.isGuest ? "Invitado" : user?.name || "Usuario"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer text-xs">
                    {user?.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />

                  {!user?.isGuest && (
                    <>
                      <DropdownMenuItem
                        className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                        onClick={() => setIsSettingsOpen(true)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configuración
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700" />
                    </>
                  )}

                  {!user?.isGuest && (
                    <>
                      <DropdownMenuItem
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                        onClick={() => setIsClearDialogOpen(true)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Resetear Shows
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700" />
                    </>
                  )}

                  <DropdownMenuItem
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                    onClick={() => {
                      console.log("[v0] Logout button clicked")
                      logout()
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {user?.isGuest ? "Salir del Modo Invitado" : "Salir"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Settings Dialog */}
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
              {/* Settings Content */}
              <div className="space-y-6">
                {/* Profile Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Perfil de Usuario
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-300">Nombre de usuario</Label>
                      <div className="mt-2 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400">
                        {user?.name || userProfile.profileName || "No registrado"}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm text-gray-300">Foto artística</Label>
                      <div className="mt-2 flex items-center gap-4">
                        {userProfile.profileImage && (
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600">
                            <img
                              src={userProfile.profileImage || "/placeholder.svg"}
                              alt="Perfil"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                            className="hidden"
                            id="profile-image-upload"
                          />
                          <label
                            htmlFor="profile-image-upload"
                            className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white text-sm transition-colors"
                          >
                            {userProfile.profileImage ? "Actualizar foto" : "Subir foto artística"}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Colores para Eventos
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-300">Categorías de eventos (tus shows)</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                        {userSettings.eventColors.map((color, index) => (
                          <div key={index} className="flex flex-col items-center gap-2 bg-gray-700/50 p-3 rounded-lg">
                            <div
                              className="w-12 h-12 rounded-full border-2 border-gray-600 shadow-lg"
                              style={{ backgroundColor: color.color }}
                            />
                            <input
                              type="text"
                              value={color.name}
                              onChange={(e) => {
                                const newColors = [...userSettings.eventColors]
                                newColors[index].name = e.target.value
                                setUserSettings((prev) => ({
                                  ...prev,
                                  eventColors: newColors,
                                }))
                              }}
                              className="w-full h-8 px-2 text-xs bg-gray-600 border border-gray-500 rounded text-white text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ej: Shows, Ensayo, Estudio"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    onClick={handleSaveAllSettings}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Configuración
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Clear Data Dialog */}
          <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Confirmar Eliminación
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-300">
                  ¿Estás seguro de que deseas eliminar todos tus shows? Esta acción no se puede deshacer.
                </p>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-sm text-red-300">
                    <strong>Se eliminará permanentemente:</strong>
                  </p>
                  <ul className="text-xs text-red-400 mt-1 list-disc list-inside">
                    <li>Todos los eventos agendados</li>
                    <li>Fechas y recordatorios</li>
                    <li>Imágenes subidas</li>
                  </ul>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsClearDialogOpen(false)}
                    disabled={isClearing}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleClearAllData}
                    disabled={isClearing}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isClearing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar Todo
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Calendar Container */}
          <Card className="bg-gray-800/60 backdrop-blur-xl border-gray-700/50 mb-8 shadow-xl relative overflow-hidden">
            <CardContent className="p-8 relative z-10">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-8">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth("prev")}
                  className="h-10 w-10 bg-gray-700/60 backdrop-blur-sm border border-gray-600/60 hover:bg-gray-700/80 hover:scale-105 transition-all duration-200 rounded-xl group"
                >
                  <ChevronLeft className="h-5 w-5 group-hover:text-blue-400 transition-colors" />
                </Button>

                <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth("next")}
                  className="h-10 w-10 bg-gray-700/60 backdrop-blur-sm border border-gray-600/60 hover:bg-gray-700/80 hover:scale-105 transition-all duration-200 rounded-xl group"
                >
                  <ChevronRight className="h-5 w-5 group-hover:text-blue-400 transition-colors" />
                </Button>
              </div>

              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
                {weekDays.map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-400 py-1 sm:py-2 text-xs sm:text-sm">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {days.map((day, index) => {
                  // Obtener colores de eventos para el día
                  const eventColors = day.events.map((event) => event.color)
                  const hasEvents = day.events.length > 0
                  const dayOfWeek = weekDaysAbbr[day.date.getDay()]

                  return (
                    <div
                      key={index}
                      className={`
                      relative
                      transition-all duration-200 hover:scale-[1.02] hover:shadow-lg
                      rounded-lg border
                      ${
                        day.isCurrentMonth
                          ? "border-gray-600/50 hover:border-gray-500/50 cursor-pointer"
                          : "bg-gray-800/40 border-gray-700/50 opacity-50"
                      }
                      ${
                        day.date.toDateString() === new Date().toDateString()
                          ? "ring-2 ring-blue-500/50 border-blue-500/30"
                          : ""
                      }
                      ${
                        day.date.toDateString() === new Date().toDateString() && hasEvents && day.isCurrentMonth
                          ? "animate-bounce shadow-2xl shadow-blue-500/50 ring-4 ring-blue-400/60 border-2 border-blue-400 bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                          : ""
                      }
                      // Responsive sizing
                      min-h-[60px] sm:min-h-[80px] p-1 sm:p-2
                    `}
                      onClick={() => handleDayClick(day)}
                      onDoubleClick={() => handleDayDoubleClick(day)}
                      onTouchStart={(e) => {
                        const timer = setTimeout(() => handleDayLongPress(day), 500)
                        const clearTimer = () => clearTimeout(timer)
                        const element = e.currentTarget as HTMLElement
                        element.addEventListener("touchend", clearTimer, { once: true })
                        element.addEventListener("touchmove", clearTimer, { once: true })
                      }}
                      style={{
                        ...(hasEvents &&
                          day.isCurrentMonth && {
                            ...(eventColors.length === 1
                              ? {
                                  backgroundColor: eventColors[0],
                                  borderColor: eventColors[0],
                                  boxShadow: `0 4px 12px ${eventColors[0]}50, inset 0 0 20px ${eventColors[0]}30`,
                                }
                              : {
                                  background: `linear-gradient(135deg, ${eventColors[0]}, ${eventColors[eventColors.length - 1] || eventColors[0]})`,
                                  borderColor: eventColors[0],
                                  boxShadow: `0 4px 12px ${eventColors[0]}50, inset 0 0 20px ${eventColors[0]}30`,
                                }),
                          }),
                        ...(!hasEvents &&
                          day.isCurrentMonth && {
                            backgroundColor: "rgba(55, 65, 81, 0.4)", // bg-gray-700/40
                          }),
                      }}
                    >
                      {/* Top section: Day number and day of week */}
                      <div className="flex flex-col items-start">
                        <div
                          className={`
                        font-bold
                        ${hasEvents && day.isCurrentMonth ? "text-white" : "text-gray-300"}
                        text-sm sm:text-base
                        leading-tight
                      `}
                        >
                          {day.date.getDate()}
                        </div>
                        <div
                          className={`
                        text-xs font-medium
                        ${hasEvents && day.isCurrentMonth ? "text-white/80" : "text-gray-400"}
                        leading-tight
                      `}
                        >
                          {dayOfWeek}
                        </div>
                      </div>

                      {/* Event images - small thumbnails */}
                      <div className="absolute top-1 right-1">
                        {day.events.slice(0, 2).map(
                          (event, eventIndex) =>
                            event.imageUrl && (
                              <div
                                key={eventIndex}
                                className="w-4 h-4 sm:w-5 sm:h-5 rounded-sm border border-white/20 cursor-pointer hover:scale-110 transition-transform"
                                style={{
                                  backgroundImage: `url(${event.imageUrl})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  marginLeft: eventIndex > 0 ? "-8px" : "0",
                                  zIndex: eventIndex,
                                }}
                                onDoubleClick={(e) => handleEventDoubleClick(event, e)}
                                onTouchStart={(e) => {
                                  const timer = setTimeout(() => handleEventLongPress(event), 500)
                                  const clearTimer = () => clearTimeout(timer)
                                  const element = e.currentTarget as HTMLElement
                                  element.addEventListener("touchend", clearTimer, { once: true })
                                  element.addEventListener("touchmove", clearTimer, { once: true })
                                }}
                                title={event.title}
                              />
                            ),
                        )}
                      </div>

                      {/* Bottom right: Event indicators */}
                      <div className="absolute bottom-1 right-1">
                        {/* Desktop: Show event count */}
                        <div className="hidden sm:block">
                          {hasEvents && (
                            <div
                              className={`
                            text-xs font-bold px-1.5 py-0.5 rounded-full
                            ${hasEvents && day.isCurrentMonth ? "bg-white/20 text-white" : "bg-gray-600/40 text-gray-300"}
                          `}
                            >
                              {day.events.length}
                            </div>
                          )}
                        </div>

                        {/* Mobile: Show dots */}
                        <div className="sm:hidden">
                          {hasEvents && (
                            <div className="flex space-x-0.5">
                              {day.events.slice(0, 3).map((event, eventIndex) => (
                                <div
                                  key={eventIndex}
                                  className="w-1 h-1 rounded-full bg-white/90"
                                  style={{
                                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                                  }}
                                />
                              ))}
                              {day.events.length > 3 && <div className="w-1 h-1 rounded-full bg-white/70" />}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Events List */}
          <Card className="bg-gray-800/60 backdrop-blur-xl border-gray-700/50 shadow-xl relative overflow-hidden">
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {/* Navigation buttons */}
                  <Button
                    onClick={() => navigateMonth("prev")}
                    variant="outline"
                    size="sm"
                    className="bg-gray-700/60 backdrop-blur-sm border-gray-600/60 text-gray-300 hover:bg-gray-600/80 hover:text-white transition-all duration-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    Eventos de {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>

                  <Button
                    onClick={() => navigateMonth("next")}
                    variant="outline"
                    size="sm"
                    className="bg-gray-700/60 backdrop-blur-sm border-gray-600/60 text-gray-300 hover:bg-gray-600/80 hover:text-white transition-all duration-200"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Download TXT button */}
                  <Button
                    onClick={handleDownloadEventsTXT}
                    variant="outline"
                    size="sm"
                    className="bg-gray-700/60 backdrop-blur-sm border-gray-600/60 text-gray-300 hover:bg-gray-600/80 hover:text-white transition-all duration-200"
                    title="Descargar eventos en formato TXT"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                {currentMonthEvents.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No hay eventos este mes</p>
                    <p className="text-sm mt-2">Haz clic en "Nuevo Evento" para agregar uno</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentMonthEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-gray-700/40 backdrop-blur-sm border border-gray-600/50 rounded-lg p-4 hover:bg-gray-700/60 transition-all duration-200 hover:shadow-lg hover:scale-[1.01] group"
                        style={{
                          background: generateGradient([event.color]),
                          boxShadow: generateShadow([event.color]),
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {/* Event thumbnail */}
                              {event.imageUrl && (
                                <div
                                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-md border border-white/20 flex-shrink-0 cursor-pointer hover:scale-110 transition-transform"
                                  style={{
                                    backgroundImage: `url(${event.imageUrl})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                  }}
                                  onDoubleClick={(e) => handleEventDoubleClick(event, e)}
                                  onTouchStart={(e) => {
                                    const timer = setTimeout(() => handleEventLongPress(event), 500)
                                    const clearTimer = () => clearTimeout(timer)
                                    const element = e.currentTarget as HTMLElement
                                    element.addEventListener("touchend", clearTimer, { once: true })
                                    element.addEventListener("touchmove", clearTimer, { once: true })
                                  }}
                                  title={event.title}
                                />
                              )}
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }} />
                              <h4 className="font-semibold text-white text-lg group-hover:text-blue-300 transition-colors">
                                {event.title}
                              </h4>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-2">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span>
                                  {new Date(event.date).toLocaleDateString("es-ES", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{event.time}</span>
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>

                            {event.notes && <p className="text-sm text-gray-400 mb-2">{event.notes}</p>}
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditEvent(event)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteEvent(event.id)}
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event View Dialog */}
      <Dialog open={isEventViewOpen} onOpenChange={setIsEventViewOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Detalles del Evento</DialogTitle>
          </DialogHeader>
          {selectedEventForView && (
            <div className="space-y-4">
              {/* Event Image */}
              {selectedEventForView.imageUrl && (
                <div className="relative group">
                  <div className="w-full h-48 sm:h-64 rounded-lg overflow-hidden">
                    <img
                      src={selectedEventForView.imageUrl || "/placeholder.svg"}
                      alt={selectedEventForView.title}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={handleViewFullImage}
                    />
                  </div>
                  {/* Image overlay buttons */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      onClick={handleViewFullImage}
                      size="sm"
                      className="bg-black/60 hover:bg-black/80 text-white border-0 backdrop-blur-sm"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleDownloadImage}
                      size="sm"
                      className="bg-black/60 hover:bg-black/80 text-white border-0 backdrop-blur-sm"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Event Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedEventForView.color }} />
                  <h3 className="text-lg font-semibold text-white">{selectedEventForView.title}</h3>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {new Date(selectedEventForView.date).toLocaleDateString("es-MX", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span>{selectedEventForView.time}</span>
                </div>

                {selectedEventForView.location && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedEventForView.location}</span>
                  </div>
                )}

                {selectedEventForView.notes && (
                  <div className="text-gray-300">
                    <p className="font-medium mb-1">Notas:</p>
                    <p className="text-sm text-gray-400">{selectedEventForView.notes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-700">
                <Button
                  onClick={() => {
                    handleEditEvent(selectedEventForView)
                    setIsEventViewOpen(false)
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  onClick={() => {
                    handleDeleteEvent(selectedEventForView.id)
                    setIsEventViewOpen(false)
                  }}
                  variant="outline"
                  className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Full Image Dialog */}
      <Dialog open={isFullImageOpen} onOpenChange={setIsFullImageOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 p-0 max-w-7xl max-h-[95vh] overflow-hidden">
          <div className="relative">
            {/* Close button */}
            <Button
              onClick={() => setIsFullImageOpen(false)}
              size="sm"
              className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/80 text-white border-0 backdrop-blur-sm rounded-full"
            >
              ×
            </Button>

            {/* Download button */}
            {selectedEventForView?.imageUrl && (
              <Button
                onClick={handleDownloadImage}
                size="sm"
                className="absolute top-4 right-16 z-10 bg-black/60 hover:bg-black/80 text-white border-0 backdrop-blur-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
            )}

            {/* Full size image */}
            {selectedEventForView?.imageUrl && (
              <div className="flex items-center justify-center min-h-[60vh] max-h-[95vh] p-4">
                <img
                  src={selectedEventForView.imageUrl || "/placeholder.svg"}
                  alt={selectedEventForView.title}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            )}

            {/* Image info */}
            {selectedEventForView && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white text-lg font-semibold">{selectedEventForView.title}</h3>
                <p className="text-gray-300 text-sm">
                  {new Date(selectedEventForView.date).toLocaleDateString("es-MX", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  • {selectedEventForView.time}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Creation/Edit Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{editingEvent ? "Editar Evento" : "Nuevo Evento"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-300">
                Nombre del show
              </Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Ej: Concierto en El Plaza Condesa"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-gray-300">
                  Fecha
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="time" className="text-gray-300">
                  Hora
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="text-gray-300">
                Venue / Lugar
              </Label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Ej: Foro Indie Rocks! CDMX"
              />
            </div>

            <div>
              <Label htmlFor="color" className="text-gray-300">
                Tipo de evento
              </Label>
              <div className="flex gap-2 mt-2">
                {userSettings.eventColors.map((colorOption) => (
                  <button
                    key={colorOption.color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: colorOption.color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === colorOption.color
                        ? "border-white scale-110"
                        : "border-gray-600 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: colorOption.color }}
                    title={colorOption.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-gray-300">
                Notas
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Detalles del show: duración, caché, backline, rider..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="imageFile" className="text-gray-300">
                Flyer del show
              </Label>
              <Input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="bg-gray-700 border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl || "/placeholder.svg"}
                    alt="Vista previa"
                    className="w-full h-32 object-cover rounded-lg border border-gray-600"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEventDialogOpen(false)
                  setEditingEvent(null)
                  setFormData({
                    title: "",
                    date: "",
                    time: "20:00",
                    location: "",
                    color: userSettings.eventColors[0]?.color || "#007AFF",
                    notes: "",
                    imageUrl: "",
                  })
                  // Limpiar el input de archivo
                  const fileInput = document.getElementById("imageFile") as HTMLInputElement
                  if (fileInput) fileInput.value = ""
                }}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingEvent ? "Actualizar" : "Crear"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
