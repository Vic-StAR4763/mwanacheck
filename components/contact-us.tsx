"use client"

import { useState } from "react"
import { Mail, Phone, MessageCircle, ExternalLink } from "lucide-react"

interface ContactUsProps {
  variant?: "button" | "card" | "inline" | "floating"
  size?: "sm" | "md" | "lg"
  showBoth?: boolean
  className?: string
}

export function ContactUs({ variant = "button", size = "md", showBoth = true, className = "" }: ContactUsProps) {
  const [showOptions, setShowOptions] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const contactEmail = "vfrancis4763@gmail.com"
  const contactPhone = "+254717495450"
  const displayPhone = "+254 717 495 450"

  const handleEmailClick = () => {
    const subject = encodeURIComponent("MwanaCheck Support Request")
    const body = encodeURIComponent(
      "Hello MwanaCheck Support Team,\n\nI need assistance with:\n\n[Please describe your issue or question here]\n\nThank you!",
    )
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`
  }

  const handlePhoneClick = () => {
    window.location.href = `tel:${contactPhone}`
  }

  // Size configurations
  const sizeConfig = {
    sm: {
      button: "px-3 py-1.5 text-xs",
      icon: "h-3 w-3",
      text: "text-xs",
      card: "p-3",
    },
    md: {
      button: "px-4 py-2 text-sm",
      icon: "h-4 w-4",
      text: "text-sm",
      card: "p-4",
    },
    lg: {
      button: "px-6 py-3 text-base",
      icon: "h-5 w-5",
      text: "text-base",
      card: "p-6",
    },
  }

  const config = sizeConfig[size]

  // Button variant
  if (variant === "button") {
    if (showBoth) {
      return (
        <div className={`relative ${className}`}>
          <button
            onClick={() => setShowOptions(!showOptions)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`${config.button} bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md`}
          >
            <MessageCircle className={config.icon} />
            <span>Contact Us</span>
            {isHovered && <ExternalLink className="h-3 w-3 opacity-75" />}
          </button>

          {showOptions && (
            <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-48 z-50">
              <button
                onClick={handleEmailClick}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
              >
                <Mail className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Send Email</div>
                  <div className="text-xs text-gray-500">{contactEmail}</div>
                </div>
              </button>
              <button
                onClick={handlePhoneClick}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
              >
                <Phone className="h-4 w-4 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Call Now</div>
                  <div className="text-xs text-gray-500">{displayPhone}</div>
                </div>
              </button>
            </div>
          )}

          {showOptions && <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)} />}
        </div>
      )
    } else {
      return (
        <button
          onClick={handleEmailClick}
          className={`${config.button} bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium rounded-lg transition-colors flex items-center space-x-2 ${className}`}
        >
          <Mail className={config.icon} />
          <span>Contact Us</span>
        </button>
      )
    }
  }

  // Card variant
  if (variant === "card") {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${config.card} ${className}`}
      >
        <div className="flex items-center space-x-2 mb-3">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Need Help?</h3>
        </div>
        <p className={`text-gray-600 dark:text-gray-400 mb-4 ${config.text}`}>
          Get in touch with our support team for assistance.
        </p>
        <div className="space-y-2">
          <button
            onClick={handleEmailClick}
            className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Mail className="h-4 w-4 text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-gray-100">Email Support</div>
              <div className="text-xs text-gray-500 dark:text-gray-300">{contactEmail}</div>
            </div>
          </button>
          <button
            onClick={handlePhoneClick}
            className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Phone className="h-4 w-4 text-green-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-gray-100">Call Support</div>
              <div className="text-xs text-gray-500 dark:text-gray-300">{displayPhone}</div>
            </div>
          </button>
        </div>
      </div>
    )
  }

  // Inline variant
  if (variant === "inline") {
    return (
      <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
        <button
          onClick={handleEmailClick}
          className={`${config.button} border border-blue-200 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors flex items-center justify-center space-x-2`}
        >
          <Mail className={config.icon} />
          <span>Email Us</span>
        </button>
        <button
          onClick={handlePhoneClick}
          className={`${config.button} border border-green-200 text-green-600 hover:bg-green-50 font-medium rounded-lg transition-colors flex items-center justify-center space-x-2`}
        >
          <Phone className={config.icon} />
          <span>Call Us</span>
        </button>
      </div>
    )
  }

  // Floating variant
  if (variant === "floating") {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            title="Contact Support"
          >
            <MessageCircle className="h-6 w-6" />
          </button>

          {showOptions && (
            <div className="absolute bottom-full mb-4 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-48">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <div className="font-semibold text-gray-900 dark:text-gray-100">Contact Support</div>
                <div className="text-xs text-gray-500 dark:text-gray-300">We're here to help!</div>
              </div>
              <button
                onClick={handleEmailClick}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
              >
                <Mail className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Send Email</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">Quick response</div>
                </div>
              </button>
              <button
                onClick={handlePhoneClick}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
              >
                <Phone className="h-4 w-4 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Call Now</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">Immediate help</div>
                </div>
              </button>
            </div>
          )}

          {showOptions && <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)} />}
        </div>
      </div>
    )
  }

  return null
}

// Quick contact links for footer/header usage
export function QuickContactLinks({ className = "" }: { className?: string }) {
  const contactEmail = "vfrancis4763@gmail.com"
  const contactPhone = "+254717495450"
  const displayPhone = "+254 717 495 450"

  const handleEmailClick = () => {
    const subject = encodeURIComponent("MwanaCheck Support Request")
    const body = encodeURIComponent(
      "Hello MwanaCheck Support Team,\n\nI need assistance with:\n\n[Please describe your issue or question here]\n\nThank you!",
    )
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`
  }

  const handlePhoneClick = () => {
    window.location.href = `tel:${contactPhone}`
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <button
        onClick={handleEmailClick}
        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
        title="Send us an email"
      >
        <Mail className="h-4 w-4" />
        <span className="text-sm">{contactEmail}</span>
      </button>
      <div className="h-4 w-px bg-gray-300" />
      <button
        onClick={handlePhoneClick}
        className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
        title="Call us now"
      >
        <Phone className="h-4 w-4" />
        <span className="text-sm">{displayPhone}</span>
      </button>
    </div>
  )
}
