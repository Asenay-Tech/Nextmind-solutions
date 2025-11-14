import { Category } from "../types"

export const categories: Category[] = [
  { id: "AI", label: "AI Agents", color: "bg-purple-500" },
  { id: "Automation", label: "Automation", color: "bg-blue-500" },
  { id: "Logistics", label: "Logistics", color: "bg-cyan-500" },
  { id: "Real Estate", label: "Real estate", color: "bg-teal-500" },
  { id: "Insurance", label: "Insurance", color: "bg-green-500" },
  { id: "IT Ops", label: "IT Ops", color: "bg-indigo-500" },
  { id: "Finance", label: "Finance", color: "bg-emerald-500" },
  { id: "Marketing", label: "Marketing", color: "bg-pink-500" },
  { id: "Data Eng", label: "Data Eng", color: "bg-violet-500" },
  { id: "Customer Services", label: "Customer Services", color: "bg-amber-500" },
  { id: "Other", label: "Other", color: "bg-gray-500" },
]

export const getCategoryColor = (categoryId: string): string => {
  const category = categories.find((cat) => cat.id === categoryId)
  return category?.color ?? "bg-gray-500"
}

export const getCategoryLabel = (categoryId: string): string => {
  const category = categories.find((cat) => cat.id === categoryId)
  return category?.label ?? categoryId
}

