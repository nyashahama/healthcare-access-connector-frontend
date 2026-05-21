import { createFileRoute } from '@tanstack/react-router'
import SymptomChecker from '@/views/patient/symptom-checker'

export const Route = createFileRoute('/patient/symptom-checker')({
  component: SymptomChecker,
})
