import { createFileRoute } from '@tanstack/react-router'
import LabResults from '@/views/patient/lab-results'

export const Route = createFileRoute('/patient/lab-results')({
  component: LabResults,
})
