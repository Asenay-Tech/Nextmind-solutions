import { Service } from "../types"

export const servicesData: Service[] = [
  {
    id: "ai-agents",
    title: "AI Agents & Automation",
    description:
      "Deploy autonomous agents that handle customer service, sales, and back-office tasks with human-level context.",
    icon: "Bot",
    category: ["AI", "Automation", "Customer Services", "Insurance"],
    tags: [
      "AI Agents",
      "Automation",
      "Customer Services",
      "Insurance",
      "Customer Support",
      "Sales Automation",
      "Agent Assist",
      "RPA",
    ],
    cta: "Explore more →",
    featured: true,
    slug: "ai-agents",
    subtopics: [
      {
        id: "customer-service",
        title: "Customer Service Automation",
        description:
          "Omnichannel virtual agents that triage tickets, answer FAQs, and escalate with full context.",
        features: [
          "24/7 chat, email, and voice deflection",
          "Knowledge-base grounding with citations",
          "Sentiment detection & auto-escalation",
          "CRM/ITSM sync (Zendesk, ServiceNow)",
          "Continuous learning from resolved tickets",
        ],
      },
      {
        id: "support-copilot",
        title: "Agent Assist Copilots",
        description:
          "Real-time copilots that summarize history, propose replies, and surface next-best actions.",
        features: [
          "Live conversation insights & call notes",
          "Suggested replies with tone matching",
          "Automatic case summaries & wrap-up notes",
          "Workflow triggers directly from chat",
          "Compliance guardrails with audit trail",
        ],
      },
      {
        id: "sales-outreach",
        title: "Autonomous Sales Outreach",
        description:
          "Prospecting agents that research accounts, craft tailored cadences, and schedule meetings.",
        features: [
          "AI Agent–driven lead research & enrichment",
          "Personalized cadence generation",
          "Calendar orchestration & reminders",
          "CRM sync (HubSpot, Salesforce)",
          "Pipeline and conversion analytics",
        ],
      },
      {
        id: "ops-automation",
        title: "Back-Office AI Agent Operators",
        description:
          "Digital workers that extract data, validate inputs, and push updates to ERP/CRM stacks.",
        features: [
          "Document OCR & entity extraction",
          "Business-rule validation & approvals",
          "ERP / spreadsheet automation",
          "Exception queue handling",
          "End-to-end audit logs",
        ],
      },
      {
        id: "intake-routing",
        title: "Smart Intake & Routing",
        description:
          "AI Agent–powered front door forms and inboxes that classify intent, enrich metadata, and dispatch work.",
        features: [
          "Dynamic intake forms & templates",
          "Intent classification & enrichment",
          "Policy-based routing & SLAs",
          "Integrated alerts & notifications",
          "Analytics on spikes and demand",
        ],
      },
    ],
  },
  {
    id: "inventory-logistics",
    title: "Inventory & Logistics Systems",
    description:
      "Gain real-time visibility and control over inventory, supply chain, and warehouse operations with intelligent automation.",
    icon: "PackageSearch",
    category: ["Logistics", "Automation", "Data Eng"],
    tags: [
      "Logistics",
      "Automation",
      "Data Eng",
      "Supply Chain",
      "Inventory Management",
      "Retail",
      "Operations",
    ],
    cta: "Explore more →",
    featured: true,
    slug: "inventory-logistics",
    subtopics: [
      {
        id: "inventory-management",
        title: "Smart Inventory Management",
        description:
          "Automated tracking, restocking, and forecasting to reduce stock-outs and overstock situations.",
        features: [
          "Real-time stock level monitoring",
          "Low-stock alerts & replenishment triggers",
          "Historical demand pattern analysis",
          "Multi-location inventory sync",
          "POS & ERP integrations",
        ],
      },
      {
        id: "logistics-optimization",
        title: "Logistics Route Optimization",
        description:
          "AI Agent–powered planning tools to optimize delivery routes, reduce delays, and improve fleet efficiency.",
        features: [
          "Traffic & weather-aware routing",
          "Dynamic dispatch & load balancing",
          "Predictive ETAs with GPS tracking",
          "Driver performance analytics",
          "Carrier API integrations",
        ],
      },
      {
        id: "warehouse-automation",
        title: "Warehouse Automation",
        description:
          "Digitize warehouse workflows for faster picking, accurate handling, and improved throughput.",
        features: [
          "Barcode/QR scanning workflows",
          "Putaway & picking optimization",
          "Cycle counting automation",
          "Robotics integration support",
          "Stock movement dashboards",
        ],
      },
      {
        id: "supply-chain-intelligence",
        title: "Supply Chain Intelligence",
        description:
          "Make smarter procurement and supply decisions with AI Agent–powered forecasting and analytics.",
        features: [
          "Supplier lead-time analysis",
          "Demand forecasting models",
          "Procurement cycle visualization",
          "Inventory aging reports",
          "Disruption risk alerts",
        ],
      },
      {
        id: "retail-ops-tools",
        title: "Retail & Operations Tools",
        description:
          "Enhance front-line ops with intelligent pricing, customer insights, and seamless returns handling.",
        features: [
          "Smart POS integration",
          "AI Agent–led product categorization",
          "Dynamic pricing optimization",
          "Customer behavior insights",
          "Returns & exchange automation",
        ],
      },
      {
        id: "data-integration",
        title: "ERP & Logistics Data Integration",
        description:
          "Connect operations with existing business tools for centralized visibility and sync.",
        features: [
          "ERP connectors (SAP, Odoo, Zoho)",
          "CRM inventory synchronization",
          "Carrier API pipelines",
          "Google Sheets & Excel syncing",
          "Real-time webhook streams",
        ],
      },
    ],
  },
  {
    id: "automated-billing-payroll",
    title: "Automated Billing & Payroll",
    description:
      "Streamline finance operations with automated invoicing, salary generation, tax compliance, and payment scheduling.",
    icon: "ReceiptText",
    category: ["Finance", "Automation", "AI"],
    tags: [
      "Finance",
      "Automation",
      "AI Agents",
      "Billing",
      "Payroll",
      "Accounting",
      "Compliance",
    ],
    cta: "Explore more →",
    featured: true,
    slug: "automated-billing-payroll",
    subtopics: [
      {
        id: "invoice-automation",
        title: "Invoice OCR & Validation",
        description:
          "Extract and process invoices automatically with structured export to accounting systems.",
        features: [
          "AI Agent–powered OCR for PDF/email/scans",
          "Vendor validation & line matching",
          "Duplicate detection & fraud alerts",
          "GL code & cost center mapping",
          "Exports to Xero / QuickBooks / SAP",
        ],
      },
      {
        id: "payroll-generation",
        title: "Payroll Slip Generation",
        description:
          "Generate accurate pay slips across departments with attendance and tax logic baked in.",
        features: [
          "Attendance & leave sync",
          "Salary structure builder",
          "Localized tax deduction rules",
          "Automated payslip PDFs & delivery",
          "HR analytics dashboard",
        ],
      },
      {
        id: "compliance-automation",
        title: "Tax & Compliance Automation",
        description:
          "Ensure billing and payroll comply with local, regional, and internal policy requirements.",
        features: [
          "Tax regulation templates",
          "Threshold & variance alerts",
          "Filing-ready summary reports",
          "Immutable audit trails",
          "Country-specific compliance packs",
        ],
      },
      {
        id: "vendor-payment-scheduler",
        title: "Vendor Payment Scheduler",
        description:
          "Schedule and execute vendor payments with workflow approvals and budget alignment.",
        features: [
          "Net-term enforcement (Net-30/45/60)",
          "Multi-currency & gateway support",
          "Email reminders & approval nudges",
          "Budget sync & burn alerts",
          "Ledger export & reconciliation",
        ],
      },
      {
        id: "salary-tax-matching",
        title: "Salary & Tax Reconciliation",
        description:
          "Cross-match salary payouts and tax deposits for monthly or board-level reporting.",
        features: [
          "Bank/payroll reconciliation dashboard",
          "Mismatch alerts & fix suggestions",
          "Multi-period comparative reports",
          "Role-based financial access",
          "Exportable compliance packs",
        ],
      },
    ],
  },
  {
    id: "finance-expense-insights",
    title: "Finance & Expense Insights",
    description:
      "Get financial clarity with AI Agent–powered expense dashboards, fraud detection, forecasting, and budget monitoring.",
    icon: "LineChart",
    category: ["Finance", "AI", "Data Eng", "Insurance"],
    tags: [
      "Finance",
      "AI Agents",
      "Data Eng",
      "Insurance",
      "Expense Management",
      "Forecasting",
      "Fraud Detection",
    ],
    cta: "Explore more →",
    featured: true,
    slug: "finance-expense-insights",
    subtopics: [
      {
        id: "expense-dashboard",
        title: "Real-Time Expense Dashboard",
        description:
          "Visualize spending across departments with live, drillable dashboards.",
        features: [
          "Live expense categorization",
          "Monthly/quarterly burn visualizations",
          "Budget deviation alerts",
          "Project & team drill-downs",
          "Export-ready finance summaries",
        ],
      },
      {
        id: "fraud-detection",
        title: "Expense Fraud Detection",
        description:
          "Automatically flag suspicious transactions and enforce expense governance.",
        features: [
          "Anomaly and pattern detection",
          "Duplicate & out-of-policy flags",
          "AI Agent fraud scoring per expense",
          "Receipt/image mismatch alerts",
          "Auditor review workflows",
        ],
      },
      {
        id: "forecasting",
        title: "Cash Flow & Budget Forecasting",
        description:
          "Predict cash flows, anticipate shortfalls, and enable confident planning.",
        features: [
          "Historical trend analysis",
          "Scenario planning (best / base / worst)",
          "ML time-series forecasting",
          "Capital planning dashboard",
          "Shortfall alerting & mitigations",
        ],
      },
      {
        id: "budget-tracker",
        title: "Department Budget Tracker",
        description:
          "Track allocated versus consumed budgets across teams and fiscal periods.",
        features: [
          "Budget creation & approvals",
          "Real-time consumption tracking",
          "Cross-department comparisons",
          "Overrun detection & escalation",
          "Annual vs quarterly insights",
        ],
      },
      {
        id: "spend-insights",
        title: "AI Agent Spend Insights & Recommendations",
        description:
          "Identify cost-saving opportunities and redundant spend with smart insights.",
        features: [
          "Vendor overlap detection",
          "Cost reduction recommendations",
          "Subscription usage analytics",
          "Idle asset identification",
          "Monthly efficiency scoring",
        ],
      },
    ],
  },
  {
    id: "procurement-approvals",
    title: "Procurement & Approvals",
    description:
      "Digitize the procurement journey from intake to payment with policy-based approvals and rich audit trails.",
    icon: "CheckCheck",
    category: ["Finance", "Automation", "Logistics"],
    tags: [
      "Finance",
      "Automation",
      "Logistics",
      "Purchasing",
      "Approvals",
      "Policy Control",
    ],
    cta: "Explore more →",
    featured: true,
    slug: "procurement-approvals",
    subtopics: [
      {
        id: "request-intake",
        title: "Smart Request Intake",
        description:
          "AI Agent–guided intake forms that capture the right data and auto-suggest vendors.",
        features: [
          "Dynamic form logic by category",
          "Vendor auto-suggestion from history",
          "Intent classification & tagging",
          "One-click resubmission of past requests",
          "Instant compliance validation",
        ],
      },
      {
        id: "approval-routing",
        title: "Approval Routing Engine",
        description:
          "Route procurement approvals automatically based on roles, thresholds, and policy rules.",
        features: [
          "Multi-level approval paths",
          "Timed escalations & reminders",
          "Slack / email approval triggers",
          "Conditional workflows by spend tier",
          "Tamper-proof audit timeline",
        ],
      },
      {
        id: "vendor-management",
        title: "Vendor & Supplier Management",
        description:
          "Maintain a smart directory of vendors with documentation, ratings, and risk scores.",
        features: [
          "Centralized vendor profiles",
          "Compliance doc expiry alerts",
          "Performance review & ratings",
          "Blacklisting & warning logic",
          "Segment vendors by criticality",
        ],
      },
      {
        id: "budget-control",
        title: "Budget-Aware Purchasing",
        description:
          "Prevent overspending with real-time budget checks before approvals are granted.",
        features: [
          "Live budget sync by cost center",
          "Insufficient funds warnings",
          "Budget revision workflows",
          "C-suite alerts at threshold",
          "Cross-org spend visibility",
        ],
      },
      {
        id: "procurement-analytics",
        title: "Procurement Insights & Reporting",
        description:
          "Analyze purchasing trends, supplier performance, and approval cycle efficiency.",
        features: [
          "Spend by vendor/category/team",
          "Average approval time metrics",
          "Bottleneck detection alerts",
          "Top vendors by spend/value",
          "Exportable dashboards & reports",
        ],
      },
    ],
  },
  {
    id: "sales-support",
    title: "Sales & Support Automation",
    description:
      "Enhance customer experience and boost conversions with AI Agents for outreach, CRM assistance, and 24/7 support.",
    icon: "Headset",
    category: ["AI", "Automation", "Customer Services", "Marketing", "Insurance"],
    tags: [
      "AI Agents",
      "Automation",
      "Customer Services",
      "Marketing",
      "Insurance",
      "CRM",
      "Customer Experience",
      "Lead Generation",
    ],
    cta: "Explore more →",
    featured: true,
    slug: "sales-support",
    subtopics: [
      {
        id: "crm-assistant",
        title: "CRM Assistant Agents",
        description:
          "AI Agent copilots that enrich leads, surface insights, and keep pipelines healthy.",
        features: [
          "Automated lead qualification & scoring",
          "Next-best action recommendations",
          "Calendar sync & follow-up nudges",
          "CRM integration (Salesforce, HubSpot)",
          "Pipeline health analytics",
        ],
      },
      {
        id: "lead-gen-agent",
        title: "Lead Generation Automation",
        description:
          "Autonomous AI Agents that personalize messaging and manage cadences.",
        features: [
          "Email & LinkedIn outreach scripting",
          "Auto-personalized sequences",
          "Reply detection & meeting booking",
          "A/B testing of pitch variants",
          "Integrated cadence reporting",
        ],
      },
      {
        id: "support-ai",
        title: "24/7 Support AI Agents",
        description:
          "Omnichannel AI Agents that resolve tickets and escalate with context retention.",
        features: [
          "Chat, email & voice automation",
          "Knowledge base ingestion",
          "Context-aware escalation rules",
          "Multi-language NLP coverage",
          "Zendesk / ServiceNow compatibility",
        ],
      },
      {
        id: "call-intelligence",
        title: "Call Intelligence",
        description:
          "Analyze customer calls with AI Agents to extract sentiment, intent, and coaching cues.",
        features: [
          "Live transcription & tagging",
          "Sentiment and emotion scoring",
          "Agent coaching recommendations",
          "Keyword alerts for compliance",
          "Call performance dashboards",
        ],
      },
      {
        id: "feedback-loops",
        title: "Feedback Automation",
        description:
          "Collect, analyze, and act on feedback from chats, surveys, and reviews with AI Agents.",
        features: [
          "Post-interaction survey triggers",
          "Sentiment trend detection",
          "Auto-ticket creation for detractors",
          "NPS & CSAT analytics",
          "Voice of Customer insights",
        ],
      },
    ],
  },
  {
    id: "customer-service-ai-agent-hub",
    title: "Customer Service AI Agent Hub",
    description:
      "Deliver consistent, branded resolutions with AI Agents orchestrating tickets, feedback loops, and proactive outreach.",
    icon: "MessageCircle",
    category: ["Customer Services", "AI", "Automation"],
    tags: [
      "Customer Services",
      "AI Agents",
      "Support",
      "Ticketing",
      "CX",
      "Automation",
    ],
    cta: "Explore more →",
    featured: false,
    slug: "customer-service-ai-agent-hub",
    subtopics: [
      {
        id: "unified-support-workspace",
        title: "Unified Support Workspace",
        description:
          "Centralize every customer conversation while AI Agents route, summarize, and prepare next steps for human teams.",
        features: [
          "Channel-aware AI Agent triage & prioritization",
          "Automated case summaries with action items",
          "Real-time collaboration notes for agents",
          "Embedded knowledge suggestions with citations",
          "Lifecycle context carried across handoffs",
        ],
      },
      {
        id: "sentiment-playbooks",
        title: "Sentiment Recovery Playbooks",
        description:
          "Detect churn risk moments and launch AI Agent playbooks that coach agents and recover customer trust.",
        features: [
          "Live sentiment and effort scoring per interaction",
          "Pre-approved response templates with tone controls",
          "Escalation triggers for critical customer intents",
          "Automated follow-up cadences until resolution",
          "Executive alerts on rising negative sentiment",
        ],
      },
      {
        id: "customer-journey-analytics",
        title: "Customer Journey Analytics",
        description:
          "Visualize every touchpoint as AI Agents surface friction, highlight champions, and recommend improvements.",
        features: [
          "Journey heatmaps with turnaround benchmarks",
          "AI Agent anomaly detection on backlog growth",
          "Self-service content gap analysis",
          "Satisfaction trend reports by segment",
          "Export-ready insights for leadership reviews",
        ],
      },
    ],
  },
  {
    id: "customer-success-ai-agent-studio",
    title: "Customer Success AI Agent Studio",
    description:
      "Scale onboarding, renewals, and advocacy with AI Agents partnering alongside success managers.",
    icon: "Users",
    category: ["Customer Services", "AI", "Marketing"],
    tags: [
      "Customer Services",
      "AI Agents",
      "Customer Success",
      "Onboarding",
      "Renewals",
      "Advocacy",
    ],
    cta: "Explore more →",
    featured: false,
    slug: "customer-success-ai-agent-studio",
    subtopics: [
      {
        id: "onboarding-assistants",
        title: "Onboarding Assistants",
        description:
          "Guide new customers with AI Agents that personalize walkthroughs, answer questions, and log progress automatically.",
        features: [
          "Dynamic onboarding paths by customer segment",
          "Contextual tutorials embedded in product flows",
          "Auto-documentation of completed milestones",
          "Real-time translation for global teams",
          "Adoption nudges delivered via email and chat",
        ],
      },
      {
        id: "renewal-health-monitoring",
        title: "Renewal Health Monitoring",
        description:
          "Stay ahead of renewals with AI Agents aggregating signals, forecasting churn, and preparing success plans.",
        features: [
          "Account health scores with leading indicators",
          "AI Agent-crafted renewal briefs for managers",
          "Usage anomaly alerts and playbook suggestions",
          "Automated stakeholder outreach sequences",
          "Escalation routing for enterprise customers",
        ],
      },
      {
        id: "advocacy-engine",
        title: "Advocacy Engine",
        description:
          "Activate champions through AI Agents that capture testimonials, manage reference hubs, and celebrate wins.",
        features: [
          "Customer stakeholder mapping & updates",
          "AI Agent-drafted case studies and spotlights",
          "Reference request coordination with tracking",
          "Campaign performance dashboards for advocacy",
          "Automated celebration messages and gifting cues",
        ],
      },
    ],
  },
  {
    id: "task-workflow-automation",
    title: "Task & Workflow Automation",
    description:
      "Eliminate repetitive work with cross-application RPA, intelligent file processing, and ready-made workflow templates.",
    icon: "Workflow",
    category: ["Automation", "IT Ops", "AI"],
    tags: [
      "Automation",
      "IT Ops",
      "AI Agents",
      "RPA",
      "Operations",
      "Internal Tools",
    ],
    cta: "Explore more →",
    featured: true,
    slug: "task-workflow-automation",
    subtopics: [
      {
        id: "cross-app-rpa",
        title: "Cross-App RPA",
        description:
          "Robotic process automation across desktop, browser, and SaaS applications.",
        features: [
          "Drag-and-drop task builder",
          "Application & API integrations",
          "Resilient screen automation",
          "Exception queues & retries",
          "Centralized run monitoring",
        ],
      },
      {
        id: "file-processing",
        title: "File Parsing & Transformation",
        description:
          "Automated ingestion, validation, and transformation of structured and semi-structured files.",
        features: [
          "CSV, Excel, PDF, XML, JSON support",
          "Schema validation & error handling",
          "Batch and streaming pipelines",
          "Data cleansing & enrichment",
          "Destination mapping templates",
        ],
      },
      {
        id: "hr-workflows",
        title: "HR Workflow Templates",
        description:
          "Pre-built templates for onboarding, offboarding, and employee lifecycle automation.",
        features: [
          "Offer letter & contract automation",
          "Provisioning & access workflows",
          "360° review reminders",
          "Exit checklist automation",
          "HRIS integrations (BambooHR, Workday)",
        ],
      },
      {
        id: "bot-triggers",
        title: "Slack/Teams Bot Triggers",
        description:
          "Launch workflows instantly via chat commands, buttons, or events.",
        features: [
          "Custom slash commands",
          "Interactive bot dialogues",
          "Alerting & announcement workflows",
          "Role-based approvals in chat",
          "Integration with internal tools",
        ],
      },
      {
        id: "approval-macros",
        title: "Approval Macros",
        description:
          "Reusable approval flows with conditional logic and rich audit history.",
        features: [
          "Branching rules by amount or role",
          "Bulk approval & delegation options",
          "Timestamped audit trail",
          "Automated reminders & escalations",
          "Integration with email and chat",
        ],
      },
    ],
  },
  {
    id: "it-infrastructure",
    title: "IT Infrastructure & Operations",
    description:
      "Optimize IT operations with DevOps automation, cloud monitoring, incident response, and FinOps guardrails.",
    icon: "Server",
    category: ["IT Ops", "Automation", "Data Eng"],
    tags: [
      "IT Ops",
      "Automation",
      "Data Eng",
      "DevOps",
      "FinOps",
      "Site Reliability",
    ],
    cta: "Explore more →",
    featured: true,
    slug: "it-infrastructure",
    subtopics: [
      {
        id: "devops-auto",
        title: "DevOps Automation",
        description:
          "CI/CD pipelines, infrastructure as code, and automated release governance.",
        features: [
          "CI/CD pipeline blueprints",
          "Infrastructure-as-code templates",
          "Automated testing orchestration",
          "Container & serverless deployments",
          "Release change approvals",
        ],
      },
      {
        id: "cloud-monitoring",
        title: "Cloud Monitoring",
        description:
          "Unified observability with intelligent alerting and anomaly detection.",
        features: [
          "Multi-cloud metrics ingestion",
          "Custom dashboards & SLO tracking",
          "Anomaly detection & RCA hints",
          "Log aggregation & search",
          "PagerDuty/On-call integrations",
        ],
      },
      {
        id: "backup-restore",
        title: "Backup & Restore",
        description:
          "Automated backup policies with rapid restore and compliance reporting.",
        features: [
          "Scheduled incremental backups",
          "Point-in-time restoration",
          "Disaster recovery runbooks",
          "Backup verification tests",
          "Encrypted storage & retention",
        ],
      },
      {
        id: "cost-optimization",
        title: "Cost Optimization",
        description:
          "Reduce cloud spending with intelligent resource optimization and guardrails.",
        features: [
          "Resource utilization heatmaps",
          "Right-sizing & idle resource alerts",
          "Reserved instance management",
          "Cost anomaly detection",
          "Budget forecasting & alerts",
        ],
      },
      {
        id: "finops-center",
        title: "FinOps Command Center",
        description:
          "FinOps tooling that aligns engineering and finance around cloud cost objectives.",
        features: [
          "Cross-team cost allocation",
          "Tag enforcement & compliance",
          "Savings plan recommendations",
          "Policy-based spend guardrails",
          "Executive reporting views",
        ],
      },
    ],
  },
  {
    id: "web-development",
    title: "Websites & Digital Presence",
    description:
      "Build immersive, SEO-friendly web experiences with CRM integration, localization, and consent automation.",
    icon: "Globe",
    category: ["Marketing", "IT Ops", "Real Estate"],
    tags: [
      "Marketing",
      "IT Ops",
      "Real Estate",
      "Web Development",
      "SEO",
      "Localization",
      "CRM",
    ],
    cta: "Explore more →",
    featured: true,
    slug: "website-development",
    subtopics: [
      {
        id: "nextjs-sites",
        title: "SEO-Optimized Next.js Sites",
        description:
          "Fast, resilient marketing sites powered by Next.js and modern CDN tooling.",
        features: [
          "Server-side and static rendering",
          "Core Web Vitals optimization",
          "Responsive design system",
          "PWA-ready architecture",
          "Analytics instrumentation baked-in",
        ],
      },
      {
        id: "crm-integration",
        title: "CRM Form Integration",
        description:
          "Seamless integration of lead capture forms with CRM and marketing automation tools.",
        features: [
          "Salesforce / HubSpot / Zoho connectors",
          "Spam & bot protection",
          "Custom field mapping & validation",
          "Webhook & API callbacks",
          "Downstream workflow triggers",
        ],
      },
      {
        id: "localization",
        title: "Localization & Accessibility",
        description:
          "Inclusive experiences that meet global languages and accessibility standards.",
        features: [
          "Multi-language switcher with fallback",
          "RTL layout support",
          "WCAG 2.1 AA compliance",
          "Semantic HTML and ARIA patterns",
          "Keyboard and screen-reader support",
        ],
      },
      {
        id: "analytics-consent",
        title: "Analytics Consent Handling",
        description:
          "GDPR-compliant analytics deployments with granular consent management.",
        features: [
          "Regional consent banners",
          "Preference management center",
          "Script blocking & auto-loading",
          "Consent logging & audits",
          "DPA-friendly data retention",
        ],
      },
      {
        id: "headless-commerce",
        title: "Headless Commerce Experiences",
        description:
          "Composable storefronts that integrate CMS, commerce, and personalization engines.",
        features: [
          "Headless CMS integration",
          "Commerce API adapters",
          "Personalized landing pages",
          "Inventory & pricing sync",
          "A/B testing hooks",
        ],
      },
    ],
  },
  {
    id: "gtc-consulting",
    title: "GTC Consulting / Business Training",
    description:
      "Executive-grade business management training led by Prof. Sebhatleab covering finance, control, and strategic leadership.",
    icon: "GraduationCap",
    category: ["Finance", "Other", "AI", "Insurance", "Marketing"],
    tags: [
      "Finance",
      "Other",
      "AI Agents",
      "Insurance",
      "Marketing",
      "Leadership",
      "Training",
    ],
    cta: "Explore more →",
    featured: true,
    slug: "gtc-consulting",
    subtopics: [
      {
        id: "financial-leadership",
        title: "Financial Leadership Intensive",
        description:
          "Master corporate finance, cash control, and board-ready reporting frameworks.",
        features: [
          "Cash flow & liquidity modeling",
          "Budgeting & variance management",
          "Internal controls playbook",
          "Financial storytelling for execs",
          "Case-based group workshops",
        ],
      },
      {
        id: "governance-controls",
        title: "Governance & Internal Controls",
        description:
          "Design resilient governance frameworks, risk controls, and audit-ready processes.",
        features: [
          "COSO & risk assessment frameworks",
          "Policy drafting templates",
          "Fraud prevention & detection labs",
          "Audit readiness checklist",
          "Industry benchmarks & playbooks",
        ],
      },
      {
        id: "strategy-ops",
        title: "Strategy & Operations Studio",
        description:
          "Translate strategy into execution with OKRs, dashboards, and operating cadences.",
        features: [
          "Strategic planning workshop",
          "OKR & KPI cascade design",
          "Cross-functional operating rituals",
          "Scenario and contingency planning",
          "Digital execution tooling primers",
        ],
      },
      {
        id: "growth-marketing",
        title: "Growth & Marketing Excellence",
        description:
          "Develop modern marketing, customer journey, and revenue enablement capabilities.",
        features: [
          "Audience segmentation frameworks",
          "Revenue funnel diagnostics",
          "Campaign experimentation systems",
          "Customer success playbooks",
          "Modern MarTech stack review",
        ],
      },
      {
        id: "people-change",
        title: "People & Change Leadership",
        description:
          "Lead transformation with culture, change management, and capability building.",
        features: [
          "Org design & talent planning",
          "Change communication templates",
          "Leadership coaching clinics",
          "Capability maturity assessments",
          "Continuous improvement rituals",
        ],
      },
    ],
  },
]

