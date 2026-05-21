import { createFileRoute } from '@tanstack/react-router'
import NutritionLibrary from '@/views/patient/nutrition-library'

export const Route = createFileRoute('/patient/nutrition')({
  component: NutritionLibrary,
})
