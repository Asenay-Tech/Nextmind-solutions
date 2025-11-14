import { CategoryType, Service } from "./types"

const categorySynonyms: Partial<Record<CategoryType, string[]>> = {
  "AI": [
    "artificial intelligence",
    "machine learning",
    "agent",
    "ai",
    "ai agent",
    "ai agents",
  ],
  "Automation": ["rpa", "robotic process", "automation"],
  "Logistics": ["supply chain", "logistics", "warehouse", "fulfillment"],
  "Real Estate": ["real estate", "property", "proptech"],
  "Insurance": ["insurance", "insurtech"],
  "IT Ops": ["it operations", "devops", "sre", "site reliability"],
  "Finance": ["finance", "finops", "accounting", "payroll", "expense"],
  "Marketing": ["marketing", "growth", "crm", "customer experience"],
  "Data Eng": ["data eng", "data engineering", "analytics", "bi"],
  "Customer Services": [
    "customer service",
    "customer support",
    "support",
    "contact center",
    "customer success",
    "cx",
  ],
  "Other": ["training", "consulting", "advisory"],
}

const normalize = (value: string) => value.toLowerCase()

export function serviceMatchesCategory(
  service: Service,
  category: CategoryType | "All",
): boolean {
  if (category === "All") return true

  const normalizedCategory = normalize(category)
  const categories = (service.category ?? []).map(normalize)
  const tags = (service.tags ?? []).map(normalize)
  const synonyms = categorySynonyms[category]?.map(normalize) ?? []

  if (categories.includes(normalizedCategory)) {
    return true
  }

  if (tags.includes(normalizedCategory)) {
    return true
  }

  return synonyms.some((alias) => tags.includes(alias))
}


