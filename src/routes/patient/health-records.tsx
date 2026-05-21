import { createFileRoute } from '@tanstack/react-router'
import HealthRecords from '@/views/patient/health-records'

export const Route = createFileRoute('/patient/health-records')({
  component: HealthRecords,
})
