import CalendarApp from '@/components/calendar-app'
import AuthGuard from '@/components/auth-guard'

export default function Home() {
  return (
    <AuthGuard>
      <CalendarApp />
    </AuthGuard>
  )
}
