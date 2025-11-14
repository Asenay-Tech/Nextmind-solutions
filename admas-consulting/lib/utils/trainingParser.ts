/**
 * Parses training module bullets into a structured hierarchical format
 */

export interface StructuredTopic {
  type: "chapter" | "section" | "subtopic"
  title: string
  level: number
  number?: string
  children?: StructuredTopic[]
}

export interface ParsedModule {
  chapters: StructuredTopic[]
}

interface TopicItem {
  number: string
  title: string
  originalLine: string
}

/**
 * Extracts number and title from various formats
 */
function parseTopicLine(line: string): TopicItem | null {
  const trimmed = line.trim().replace(/^[•\-\*]\s*/, "")
  
  // Pattern 1: "Chapter 1:", "Chapter 1: Introduction", "CHAPTER 1 Finance-"
  const chapterMatch = trimmed.match(/^chapter\s+(\d+)[\s:.-]*(.*)/i)
  if (chapterMatch) {
    return {
      number: `${chapterMatch[1]}.0`,
      title: chapterMatch[2].trim() || `Chapter ${chapterMatch[1]}`,
      originalLine: trimmed,
    }
  }
  
  // Pattern 2: "1.0:", "1.0 Background", "2.0. Management Concepts"
  const sectionMatch = trimmed.match(/^(\d+)\.0[\s:.-]*(.*)/i)
  if (sectionMatch) {
    return {
      number: sectionMatch[1] + ".0",
      title: sectionMatch[2].trim() || `Section ${sectionMatch[1]}`,
      originalLine: trimmed,
    }
  }
  
  // Pattern 3: Numbered items "1.1:", "1.1. introduction", "2.3.1. Credit Policies"
  const numberedMatch = trimmed.match(/^(\d+(?:\.\d+)+)[\s:.-]+(.+)/i)
  if (numberedMatch) {
    return {
      number: numberedMatch[1],
      title: numberedMatch[2].trim(),
      originalLine: trimmed,
    }
  }
  
  // Pattern 4: Article format "Article 1.", "Article 6. Rights and Duties"
  const articleMatch = trimmed.match(/^article\s+(\d+)[\s:.-]*(.*)/i)
  if (articleMatch) {
    return {
      number: `${articleMatch[1]}.0`,
      title: articleMatch[2].trim() || `Article ${articleMatch[1]}`,
      originalLine: trimmed,
    }
  }
  
  return null
}

/**
 * Formats a title with proper capitalization
 */
function formatTitle(title: string): string {
  if (!title) return title
  
  // Remove trailing dashes and clean up
  title = title.replace(/[-–—]+$/, "").trim()
  
  // If it's all uppercase (except short words), capitalize first letter only
  if (title === title.toUpperCase() && title.length > 3 && !title.includes("(")) {
    return title.charAt(0) + title.slice(1).toLowerCase()
  }
  
  // Capitalize first letter if it starts lowercase
  if (title.charAt(0) === title.charAt(0).toLowerCase()) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  
  return title
}

/**
 * Sorts topics by their number
 */
function sortTopics(topics: TopicItem[]): TopicItem[] {
  return topics.sort((a, b) => {
    const aParts = a.number.split(".").map(Number)
    const bParts = b.number.split(".").map(Number)
    
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aVal = aParts[i] || 0
      const bVal = bParts[i] || 0
      if (aVal !== bVal) {
        return aVal - bVal
      }
    }
    return 0
  })
}

/**
 * Builds hierarchical structure from sorted topics
 */
function buildHierarchy(sortedTopics: TopicItem[]): StructuredTopic[] {
  const chapters: StructuredTopic[] = []
  const chapterMap = new Map<string, StructuredTopic>()
  const sectionMap = new Map<string, StructuredTopic>()
  
  // First pass: identify which items are sections (have nested children)
  const hasNestedChildren = new Set<string>()
  for (const topic of sortedTopics) {
    const parts = topic.number.split(".").map(Number)
    if (parts.length > 2) {
      // This is a nested item like "1.1.1", so "1.1" is a section
      const parentKey = `${parts[0]}.${parts[1]}`
      hasNestedChildren.add(parentKey)
    }
  }
  
  for (const topic of sortedTopics) {
    const parts = topic.number.split(".").map(Number)
    const chapterNum = parts[0]
    const chapterKey = `${chapterNum}.0`
    
    // Get or create chapter
    let chapter = chapterMap.get(chapterKey)
    if (!chapter) {
      // Check if this is a chapter header (ends with .0)
      if (parts.length === 2 && parts[1] === 0) {
        chapter = {
          type: "chapter",
          title: formatTitle(topic.title),
          level: 1,
          number: `${chapterNum}.0`,
          children: [],
        }
      } else {
        // Create a default chapter
        chapter = {
          type: "chapter",
          title: `Chapter ${chapterNum}`,
          level: 1,
          number: `${chapterKey}`,
          children: [],
        }
      }
      chapterMap.set(chapterKey, chapter)
      chapters.push(chapter)
    }
    
    // Handle different topic types
    if (parts.length === 2 && parts[1] === 0) {
      // This is a chapter header - already handled above
      if (chapter.title === `Chapter ${chapterNum}` && topic.title) {
        chapter.title = formatTitle(topic.title)
      }
    } else if (parts.length === 2 && parts[1] !== 0) {
      // This is a "1.1" level item
      const sectionKey = topic.number
      
      // Check if this should be a section (has nested children or is explicitly a section)
      if (hasNestedChildren.has(sectionKey)) {
        // This is a section with nested children
        let section = sectionMap.get(sectionKey)
        if (!section) {
          section = {
            type: "section",
            title: formatTitle(topic.title),
            level: 2,
            number: topic.number,
            children: [],
          }
          sectionMap.set(sectionKey, section)
          chapter.children = chapter.children || []
          chapter.children.push(section)
        }
      } else {
        // This is a direct subtopic under chapter
        const subtopic: StructuredTopic = {
          type: "subtopic",
          title: formatTitle(topic.title),
          level: 2,
          number: topic.number,
        }
        chapter.children = chapter.children || []
        chapter.children.push(subtopic)
      }
    } else if (parts.length > 2) {
      // This is a nested subtopic (like "1.1.1", "2.3.1")
      const parentSectionKey = `${parts[0]}.${parts[1]}`
      let parentSection = sectionMap.get(parentSectionKey)
      
      if (!parentSection) {
        // Create a section for this subtopic
        parentSection = {
          type: "section",
          title: `Section ${parts[0]}.${parts[1]}`,
          level: 2,
          number: parentSectionKey,
          children: [],
        }
        sectionMap.set(parentSectionKey, parentSection)
        chapter.children = chapter.children || []
        chapter.children.push(parentSection)
      }
      
      const subtopic: StructuredTopic = {
        type: "subtopic",
        title: formatTitle(topic.title),
        level: 3,
        number: topic.number,
      }
      parentSection.children = parentSection.children || []
      parentSection.children.push(subtopic)
    }
  }
  
  return chapters
}

/**
 * Parses training module bullets into a structured hierarchy
 */
export function parseTrainingModule(bullets: string[]): ParsedModule {
  const topics: TopicItem[] = []
  const seenItems = new Set<string>()
  
  // Parse all lines
  for (const line of bullets) {
    const trimmed = line.trim()
    if (!trimmed) continue
    
    // Skip duplicates (normalize for comparison)
    const normalized = trimmed.toLowerCase().replace(/[•\-\*]/g, "").trim()
    if (seenItems.has(normalized)) continue
    seenItems.add(normalized)
    
    const parsed = parseTopicLine(trimmed)
    if (parsed) {
      topics.push(parsed)
    } else if (trimmed.length > 0) {
      // If it doesn't match any pattern, try to extract number from context
      // or treat as plain text under current chapter
      const fallbackMatch = trimmed.match(/^(\d+)[\s:.-]+(.+)/i)
      if (fallbackMatch) {
        topics.push({
          number: `${fallbackMatch[1]}.1`,
          title: fallbackMatch[2].trim(),
          originalLine: trimmed,
        })
      }
    }
  }
  
  // Sort topics by number
  const sortedTopics = sortTopics(topics)
  
  // Build hierarchy
  const chapters = buildHierarchy(sortedTopics)
  
  return { chapters }
}

