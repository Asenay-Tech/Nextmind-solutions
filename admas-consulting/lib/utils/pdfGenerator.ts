import jsPDF from "jspdf"
import type { TrainingModule } from "@/lib/trainingData"
import { parseTrainingModule, type StructuredTopic } from "./trainingParser"

const FOOTER_TEXT = {
  company: "AdmasITS – AI-Driven Systems & Intelligent Ideas",
  name: "Prof. Dr. Sebhatleab Tewolde",
  title: "Secretary, Co-Founder & Head of Department of Business Training",
  location: "Frankfurt, Germany",
  website: "admasits.com",
}

/**
 * Renders a structured topic to PDF
 */
function renderTopicToPDF(
  doc: jsPDF,
  topic: StructuredTopic,
  startY: number,
  leftMargin: number,
  lineHeight: number,
  pageWidth: number,
  rightMargin: number,
  pageHeight: number,
): number {
  let currentY = startY
  const maxWidth = pageWidth - leftMargin - rightMargin
  const footerSpace = 50 // Space reserved for footer

  if (topic.type === "chapter") {
    // Check if we need a new page before starting a chapter
    if (currentY > pageHeight - footerSpace - 20) {
      doc.addPage()
      currentY = 30
    }

    // Chapter header
    doc.setFontSize(14)
    doc.setTextColor(127, 90, 255) // Purple color
    doc.setFont("helvetica", "bold")
    
    const chapterLines = doc.splitTextToSize(topic.title, maxWidth)
    doc.text(chapterLines, leftMargin, currentY)
    currentY += chapterLines.length * lineHeight * 1.3

    // Chapter underline
    doc.setDrawColor(127, 90, 255)
    doc.setLineWidth(0.5)
    doc.line(leftMargin, currentY - 2, pageWidth - rightMargin, currentY - 2)
    currentY += lineHeight * 1.0
  } else if (topic.type === "section") {
    // Check if we need a new page
    if (currentY > pageHeight - footerSpace - 15) {
      doc.addPage()
      currentY = 30
    }

    // Section header
    doc.setFontSize(11)
    doc.setTextColor(127, 90, 255) // Purple color
    doc.setFont("helvetica", "bold")
    
    const sectionText = `${topic.number} ${topic.title}`
    const sectionLines = doc.splitTextToSize(sectionText, maxWidth - 10)
    doc.text(sectionLines, leftMargin, currentY)
    currentY += sectionLines.length * lineHeight * 1.2
  } else if (topic.type === "subtopic") {
    // Check if we need a new page
    if (currentY > pageHeight - footerSpace - 10) {
      doc.addPage()
      currentY = 30
    }

    // Subtopic
    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60) // Dark gray
    doc.setFont("helvetica", "normal")
    
    const subtopicText = topic.number ? `${topic.number} ${topic.title}` : topic.title
    const subtopicLines = doc.splitTextToSize(subtopicText, maxWidth - (leftMargin > 20 ? 10 : 0))
    doc.text(subtopicLines, leftMargin, currentY)
    currentY += subtopicLines.length * lineHeight * 1.1
  }

  // Render children
  if (topic.children && topic.children.length > 0) {
    const childIndent = topic.type === "chapter" ? leftMargin + 8 : leftMargin + 12
    for (const child of topic.children) {
      currentY = renderTopicToPDF(doc, child, currentY, childIndent, lineHeight, pageWidth, rightMargin, pageHeight)
    }
  }

  return currentY
}

/**
 * Adds footer to PDF
 */
function addFooter(doc: jsPDF, pageNumber: number, totalPages: number) {
  const pageHeight = doc.internal.pageSize.height
  const pageWidth = doc.internal.pageSize.width
  const footerY = pageHeight - 25

  // Footer divider line (thin, light gray)
  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(0.3)
  doc.line(20, footerY - 14, pageWidth - 20, footerY - 14)

  // Footer text (center aligned, 10px, muted gray #bbbbbb)
  doc.setFontSize(10)
  doc.setTextColor(187, 187, 187) // #bbbbbb
  doc.setFont("helvetica", "normal")
  
  const footerLines = [
    FOOTER_TEXT.company,
    FOOTER_TEXT.name,
    FOOTER_TEXT.title,
    FOOTER_TEXT.location,
    FOOTER_TEXT.website,
  ]

  let footerStartY = footerY - 10
  footerLines.forEach((line) => {
    doc.text(line, pageWidth / 2, footerStartY, { align: "center" })
    footerStartY += 4.5
  })

  // Page number (bottom-right corner)
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  doc.setFont("helvetica", "normal")
  const pageText = `Page ${pageNumber} of ${totalPages}`
  doc.text(pageText, pageWidth - 20, pageHeight - 10, { align: "right" })
}

/**
 * Generates PDF from training module
 */
export function generateTrainingModulePDF(module: TrainingModule): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  const leftMargin = 20
  const rightMargin = 20
  const topMargin = 30
  const lineHeight = 6

  // Parse module structure
  const parsedModule = parseTrainingModule(module.bullets)

  // Header
  doc.setFontSize(18)
  doc.setTextColor(127, 90, 255) // Purple color
  doc.setFont("helvetica", "bold")
  doc.text("AdmasITS – Training Module Outline", pageWidth / 2, topMargin, { align: "center" })

  // Header gradient line
  const gradientY = topMargin + 5
  doc.setDrawColor(127, 90, 255) // Start color #7f5aff
  doc.setLineWidth(0.8)
  doc.line(leftMargin, gradientY, pageWidth - rightMargin, gradientY)
  
  // Slight gradient effect (simplified)
  doc.setDrawColor(157, 133, 255) // End color #9d85ff
  doc.setLineWidth(0.4)
  doc.line(leftMargin, gradientY + 0.5, pageWidth - rightMargin, gradientY + 0.5)

  let currentY = topMargin + 15

  // Module title
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.setFont("helvetica", "bold")
  const titleLines = doc.splitTextToSize(module.title, pageWidth - leftMargin - rightMargin)
  doc.text(titleLines, leftMargin, currentY)
  currentY += titleLines.length * lineHeight * 1.3 + 5

  // Render chapters
  if (parsedModule.chapters.length > 0) {
    for (let i = 0; i < parsedModule.chapters.length; i++) {
      const chapter = parsedModule.chapters[i]
      
      currentY = renderTopicToPDF(
        doc,
        chapter,
        currentY,
        leftMargin,
        lineHeight,
        pageWidth,
        rightMargin,
        pageHeight,
      )
      
      // Add spacing between chapters
      if (i < parsedModule.chapters.length - 1) {
        currentY += lineHeight * 2
      }
    }
  }

  // Get total pages
  const totalPages = doc.getNumberOfPages()

  // Add footer to all pages
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    addFooter(doc, i, totalPages)
  }

  // Save PDF
  const fileName = `${module.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_outline.pdf`
  doc.save(fileName)
}

