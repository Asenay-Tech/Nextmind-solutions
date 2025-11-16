"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, ArrowRight, Bot, Package, Building2, DollarSign } from "lucide-react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Navigation structure
const navigation = {
  solutions: {
    label: "Solutions",
    href: "/solutions",
    megaMenu: true,
    items: [
      {
        title: "AI Agents & Automation",
        description: "Deploy autonomous agents for customer service, sales, and operations",
        href: "/solutions/ai-agents",
        icon: Bot,
      },
      {
        title: "Inventory & Logistics",
        description: "Intelligent supply chain and inventory management systems",
        href: "/solutions/inventory-logistics",
        icon: Package,
      },
      {
        title: "Finance & Billing",
        description: "Automated financial operations and billing workflows",
        href: "/solutions/finance-billing",
        icon: DollarSign,
      },
      {
        title: "IT Infrastructure",
        description: "Cloud-native infrastructure and DevOps automation",
        href: "/solutions/it-infrastructure",
        icon: Building2,
      },
    ],
  },
  products: {
    label: "Products",
    href: "/products",
    dropdown: true,
    items: [
      { label: "AI Agent Platform", href: "/products/agent-platform", description: "Build and deploy AI agents" },
      { label: "Automation Studio", href: "/products/automation-studio", description: "Visual workflow builder" },
      { label: "Integrations", href: "/products/integrations", description: "Connect with your tools" },
      { label: "API", href: "/docs", description: "Developer documentation" },
    ],
  },
  resources: {
    label: "Resources",
    href: "/resources",
    dropdown: true,
    items: [
      { label: "Documentation", href: "/docs", description: "Technical guides and API reference" },
      { label: "Blog", href: "/blog", description: "Insights and updates" },
      { label: "Case Studies", href: "/case-studies", description: "Customer success stories" },
      { label: "Support", href: "/support", description: "Get help and support" },
    ],
  },
  company: {
    label: "Company",
    href: "/company",
    dropdown: true,
    items: [
      { label: "About Us", href: "/about", description: "Our mission and team" },
      { label: "Careers", href: "/careers", description: "Join our team" },
      { label: "Partners", href: "/partners", description: "Partner with us" },
      { label: "Contact", href: "/contact", description: "Get in touch" },
    ],
  },
  pricing: {
    label: "Pricing",
    href: "/pricing",
    simple: true,
  },
}

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [activeMegaMenu, setActiveMegaMenu] = useState(false)
  const pathname = usePathname()
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setActiveMegaMenu(false)
      }
    }

    if (activeMegaMenu) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeMegaMenu])

  const handleDropdownEnter = (key: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setActiveDropdown(key)
  }

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  const handleMegaMenuEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setActiveMegaMenu(true)
  }

  const handleMegaMenuLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(false)
    }, 200)
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-admas-dark/95 backdrop-blur-xl shadow-lg border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group z-50">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-admas-purple-light to-admas-blue flex items-center justify-center text-white font-bold text-xl">
              A
            </div>
            <div className="hidden md:block">
              <div className="font-heading font-bold text-lg text-white group-hover:text-admas-purple-light transition-colors">
                Admas
              </div>
              <div className="text-xs text-gray-400">
                AI-Systems and Intelligent Management plc
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Solutions - Mega Menu */}
            <div
              className="relative"
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
              ref={megaMenuRef}
            >
              <Link
                href={navigation.solutions.href}
                className={cn(
                  "flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(navigation.solutions.href) || activeMegaMenu
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                )}
              >
                <span>{navigation.solutions.label}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    activeMegaMenu && "rotate-180"
                  )}
                />
              </Link>

              {activeMegaMenu && (
                <div className="absolute top-full left-0 mt-2 w-[680px] bg-admas-dark/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-6 opacity-0 animate-[fade-in_0.2s_ease-out_forwards]">
                  <div className="grid grid-cols-2 gap-4">
                    {navigation.solutions.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group p-4 rounded-lg border border-white/5 hover:border-admas-purple-light/50 hover:bg-white/5 transition-all"
                          onClick={() => setActiveMegaMenu(false)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-admas-purple-light/20 to-admas-blue/20 flex items-center justify-center flex-shrink-0 group-hover:from-admas-purple-light/30 group-hover:to-admas-blue/30 transition-colors">
                              <Icon className="w-5 h-5 text-admas-purple-light" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white group-hover:text-admas-purple-light transition-colors mb-1">
                                {item.title}
                              </h3>
                              <p className="text-xs text-gray-400 line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-admas-purple-light group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <Link
                      href="/solutions"
                      className="flex items-center justify-between text-sm font-medium text-gray-300 hover:text-white transition-colors group"
                      onClick={() => setActiveMegaMenu(false)}
                    >
                      <span>View all solutions</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Products - Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter("products")}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                href={navigation.products.href}
                className={cn(
                  "flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(navigation.products.href) || activeDropdown === "products"
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                )}
              >
                <span>{navigation.products.label}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    activeDropdown === "products" && "rotate-180"
                  )}
                />
              </Link>

              {activeDropdown === "products" && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-admas-dark/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 opacity-0 animate-[fade-in_0.2s_ease-out_forwards]">
                  {navigation.products.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <div className="font-medium text-white group-hover:text-admas-purple-light transition-colors mb-1">
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-400">{item.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Resources - Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter("resources")}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                href={navigation.resources.href}
                className={cn(
                  "flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(navigation.resources.href) || activeDropdown === "resources"
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                )}
              >
                <span>{navigation.resources.label}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    activeDropdown === "resources" && "rotate-180"
                  )}
                />
              </Link>

              {activeDropdown === "resources" && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-admas-dark/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 opacity-0 animate-[fade-in_0.2s_ease-out_forwards]">
                  {navigation.resources.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <div className="font-medium text-white group-hover:text-admas-purple-light transition-colors mb-1">
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-400">{item.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Company - Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter("company")}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                href={navigation.company.href}
                className={cn(
                  "flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(navigation.company.href) || activeDropdown === "company"
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                )}
              >
                <span>{navigation.company.label}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    activeDropdown === "company" && "rotate-180"
                  )}
                />
              </Link>

              {activeDropdown === "company" && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-admas-dark/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 opacity-0 animate-[fade-in_0.2s_ease-out_forwards]">
                  {navigation.company.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <div className="font-medium text-white group-hover:text-admas-purple-light transition-colors mb-1">
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-400">{item.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing - Simple Link */}
            <Link
              href={navigation.pricing.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive(navigation.pricing.href)
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              )}
            >
              {navigation.pricing.label}
            </Link>
          </div>

          {/* CTA Section */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                Login
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="btn-gradient" size="sm">
                Request Demo
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2 z-50"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 animate-[fade-in_0.2s_ease-out]">
            <div className="flex flex-col space-y-1">
              {/* Solutions - Mobile Accordion */}
              <MobileNavItem
                label={navigation.solutions.label}
                href={navigation.solutions.href}
                items={navigation.solutions.items.map((item) => ({
                  label: item.title,
                  href: item.href,
                  description: item.description,
                }))}
                onClose={() => setIsMobileMenuOpen(false)}
              />

              {/* Products - Mobile Accordion */}
              <MobileNavItem
                label={navigation.products.label}
                href={navigation.products.href}
                items={navigation.products.items}
                onClose={() => setIsMobileMenuOpen(false)}
              />

              {/* Resources - Mobile Accordion */}
              <MobileNavItem
                label={navigation.resources.label}
                href={navigation.resources.href}
                items={navigation.resources.items}
                onClose={() => setIsMobileMenuOpen(false)}
              />

              {/* Company - Mobile Accordion */}
              <MobileNavItem
                label={navigation.company.label}
                href={navigation.company.href}
                items={navigation.company.items}
                onClose={() => setIsMobileMenuOpen(false)}
              />

              {/* Pricing - Simple Link */}
              <Link
                href={navigation.pricing.href}
                className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {navigation.pricing.label}
              </Link>

              {/* Mobile CTA */}
              <div className="px-4 pt-4 space-y-2 border-t border-white/10 mt-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="btn-gradient w-full">
                    Request Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Mobile Navigation Item Component
function MobileNavItem({
  label,
  href,
  items,
  onClose,
}: {
  label: string
  href: string
  items: Array<{ label: string; href: string; description?: string }>
  onClose: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="pl-4 pr-2 py-2 space-y-1 animate-[fade-in_0.2s_ease-out]">
          <Link
            href={href}
            className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            onClick={onClose}
          >
            View all {label.toLowerCase()}
          </Link>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={onClose}
            >
              <div className="font-medium">{item.label}</div>
              {item.description && (
                <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
