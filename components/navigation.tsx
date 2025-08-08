"use client"

import { useAuth } from "@/lib/auth"
import { useSafeLanguage } from "@/lib/safe-hooks"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  Users,
  BookOpen,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  FileText,
  Award,
  DollarSign,
  UserCheck,
  UserPlus,
  LogIn,
} from "lucide-react"
import { useState } from "react"
import { ContactUs } from "./contact-us"
import { ThemeToggle, CompactThemeToggle } from "./theme-toggle"
import { SearchBar } from "./search/search-bar"

export function Navigation() {
  const { user, logout, initialized } = useAuth()
  const { t } = useSafeLanguage()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Provide fallback auth data for guest users
  let authData = {
    user: { role: "guest" } as any,
    logout: () => {},
    initialized: true,
    loading: false,
    login: async () => false,
  }

  if (!initialized) {
    return (
      <nav className="bg-white dark:bg-gray-900 shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex hover:opacity-80 transition-opacity duration-200 flex-row items-center justify-start space-x-3 mx-0 my-0 px-0 py-0"
              >
                <Image
                  src="/mwanacheck-logo.png"
                  alt="MwanaCheck Logo"
                  width={80}
                  height={80}
                  className="h-16 sm:h-16 md:h-18 lg:h-20 w-auto object-contain"
                  priority
                />
                <span className="font-bold text-xl text-gray-900 dark:text-gray-100 hidden sm:block ml-2">
                  MwanaCheck
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse h-10 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  if (!user || user.role === "guest") {
    authData = {
      user: { role: "guest" } as any,
      logout: () => {},
      initialized: true,
      loading: false,
      login: async () => false,
    }
  }

  // Guest navigation for unauthenticated users
  if (!user || user.role === "guest") {
    return (
      <nav className="bg-white dark:bg-gray-900 shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex hover:opacity-80 transition-opacity duration-200 flex-row items-center justify-start space-x-3 mx-0 my-0 px-0 py-0 group"
              >
                <Image
                  src="/mwanacheck-logo.png"
                  alt="MwanaCheck Logo - Student Monitoring Platform"
                  width={80}
                  height={80}
                  className="h-16 sm:h-16 md:h-18 lg:h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
                  priority
                />
                <span className="font-bold text-xl text-gray-900 dark:text-gray-100 hidden sm:block">MwanaCheck</span>
              </Link>
            </div>

            {/* Desktop Guest Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t("nav.features")}
              </Link>
              <Link
                href="#benefits"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t("nav.benefits")}
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t("nav.howItWorks")}
              </Link>
              <Link
                href="#about"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {t("nav.about")}
              </Link>
            </div>

            {/* Auth Buttons and Contact */}
            <div className="flex items-center space-x-4">
              <ThemeToggle size="sm" />
              <ContactUs variant="button" size="sm" showBoth={true} />
              <Link
                href="/login"
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>{t("nav.login")}</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center space-x-1 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>{t("nav.signup")}</span>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Guest Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Theme</span>
                <CompactThemeToggle />
              </div>
              <Link
                href="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.features")}
              </Link>
              <Link
                href="#benefits"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.benefits")}
              </Link>
              <Link
                href="#how-it-works"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.howItWorks")}
              </Link>
              <Link
                href="#about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.about")}
              </Link>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
                <div className="px-3 py-2">
                  <ContactUs variant="inline" size="sm" />
                </div>
                <Link
                  href="/login"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="h-5 w-5" />
                  <span>{t("nav.login")}</span>
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 mt-2 dark:bg-blue-700 dark:hover:bg-blue-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserPlus className="h-5 w-5" />
                  <span>{t("nav.signup")}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    )
  }

  // Authenticated user navigation
  const getNavigationItems = () => {
    switch (user.role) {
      case "admin":
        return [
          { href: "/admin", label: t("nav.dashboard"), icon: Home },
          { href: "/admin/users", label: "Manage Users", icon: Users },
          { href: "/admin/students", label: t("nav.students"), icon: Users },
          { href: "/admin/discipline", label: "Discipline Rules", icon: FileText },
          { href: "/admin/settings", label: t("nav.settings"), icon: Settings },
        ]
      case "teacher":
        return [
          { href: "/teacher", label: t("nav.dashboard"), icon: Home },
          { href: "/teacher/students", label: "My Students", icon: Users },
          { href: "/teacher/performance", label: t("nav.performance"), icon: BookOpen },
          { href: "/teacher/discipline", label: t("nav.discipline"), icon: FileText },
          { href: "/teacher/merits", label: "Award Merits", icon: Award },
        ]
      case "parent":
        return [
          { href: "/parent", label: t("nav.dashboard"), icon: Home },
          { href: "/parent/performance", label: t("nav.performance"), icon: BookOpen },
          { href: "/parent/discipline", label: t("nav.discipline"), icon: FileText },
          { href: "/parent/fees", label: t("nav.fees"), icon: CreditCard },
          { href: "/parent/payments", label: t("nav.payments"), icon: DollarSign },
        ]
      case "student":
        return [
          { href: "/student", label: t("nav.dashboard"), icon: Home },
          { href: "/student/performance", label: "My Performance", icon: BookOpen },
          { href: "/student/discipline", label: "Discipline Points", icon: UserCheck },
          { href: "/student/merits", label: "My Merits", icon: Award },
          { href: "/student/fees", label: "Fee Balance", icon: CreditCard },
        ]
      default:
        return []
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 group"
              aria-label="MwanaCheck Homepage"
            >
              <Image
                src="/mwanacheck-logo.png"
                alt="MwanaCheck Logo - Student Monitoring Platform"
                width={80}
                height={80}
                className="h-16 sm:h-16 md:h-18 lg:h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
                priority
              />
              <span className="font-bold text-xl text-gray-900 dark:text-gray-100 hidden sm:block">MwanaCheck</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-lg mx-8">
            <SearchBar placeholder="Search students, teachers, parents..." className="w-full" />
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle size="sm" />
            <ContactUs variant="button" size="sm" showBoth={true} />
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {t("nav.welcome")}, {user.name}
              </span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full capitalize">
                {t(`role.${user.role}` as any)}
              </span>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">{t("nav.logout")}</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden px-4 pb-4">
          <SearchBar placeholder="Search students, teachers, parents..." className="w-full" />
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 dark:bg-gray-800">
            <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{t(`role.${user.role}` as any)}</div>
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">Theme</span>
              <CompactThemeToggle />
            </div>
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <div className="px-3 py-2">
                <ContactUs variant="inline" size="sm" />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
