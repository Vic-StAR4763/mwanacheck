"use client"

import { ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { QuickContactLinks } from "./contact-us"

export function AboutFooter() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* About Section */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-3">
              <Image
                src="/mwanacheck-logo.png"
                alt="MwanaCheck Logo"
                width={24}
                height={24}
                className="h-6 w-auto object-contain mr-2"
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About MwanaCheck</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
              MwanaCheck is a comprehensive student monitoring platform that empowers schools, parents, and students
              through real-time academic tracking and transparent communication. Our mission is to foster student growth
              by providing actionable insights and building stronger connections within the educational community.
            </p>
          </div>

          {/* Learn More Link */}
          <div className="flex-shrink-0">
            <Link
              href="/about"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-md transition-colors duration-200"
            >
              Learn More
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <QuickContactLinks />
            <p className="text-xs text-gray-500">
              © 2024 MwanaCheck. All rights reserved. Empowering education through technology.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
