export interface Service {
  id: string
  title: string
  description: string
  icon: string
  category: CategoryType[]
  featured: boolean
  subtopics: Subtopic[]
  slug: string
  tags?: string[]
  cta?: string
}

export interface Subtopic {
  id: string
  title: string
  description: string
  features?: string[]
}

export type CategoryType =
  | "AI"
  | "Automation"
  | "Logistics"
  | "Real Estate"
  | "Insurance"
  | "IT Ops"
  | "Finance"
  | "Marketing"
  | "Data Eng"
  | "Customer Services"
  | "Other"

export interface Category {
  id: CategoryType
  label: string
  color: string
}

export interface BusinessModule {
  id: string
  title: string
  description: string
  duration: string
  level: string
  topics: string[]
}

export interface ContactFormData {
  name: string
  email: string
  company?: string
  phone?: string
  service: string
  message: string
}

export interface TrainingFormData {
  name: string
  email: string
  company: string
  phone: string
  modules: string[]
  participants: number
  preferredDate?: string
  message?: string
}

export interface TestimonialData {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar?: string
}

