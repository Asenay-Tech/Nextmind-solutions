"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { businessModules } from "@/lib/data/business-modules"
import { BarChart2, CheckCircle2, Clock } from "lucide-react"

export default function BusinessAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {businessModules.map((module) => (
        <AccordionItem
          key={module.id}
          value={String(module.id)}
          className="glass-card border-none"
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/5 rounded-t-2xl transition-colors">
            <div className="flex items-start text-left w-full">
              <div className="flex-1">
                <h3 className="text-lg font-heading font-bold text-white mb-2">
                  {module.title}
                </h3>
                <p className="text-sm text-gray-400">{module.description}</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="flex flex-wrap gap-4 mb-6 pt-4">
              <div className="flex items-center text-sm text-gray-400">
                <Clock className="w-4 h-4 mr-2 text-admas-purple-light" />
                <span>{module.duration}</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <BarChart2 className="w-4 h-4 mr-2 text-admas-blue" />
                <span>{module.level}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Topics Covered:</h4>
              <ul className="space-y-2">
                {module.topics.map((topic, index) => (
                  <li key={`${module.id}-${index}`} className="flex items-start text-gray-300 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-admas-cyan mr-2 mt-0.5 flex-shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

