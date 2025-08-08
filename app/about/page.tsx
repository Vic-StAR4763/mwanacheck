"use client"

import { ContactUs } from "@/components/contact-us"
import { GraduationCap, Users, Shield, Globe, Award, TrendingUp, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About MwanaCheck</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Transforming education through intelligent student monitoring, transparent communication, and data-driven
            insights that empower every stakeholder in the learning journey.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 mb-12">
          <div className="text-center">
            <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              To foster student growth and academic excellence by providing transparent, real-time insights that connect
              schools, parents, and students in a collaborative educational ecosystem. We believe every student deserves
              personalized attention and support to reach their full potential.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Academic Performance Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Real-time grade monitoring with predictive analytics to identify at-risk students and celebrate
                  achievements.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Discipline Management</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Point-based behavioral tracking that promotes positive reinforcement and character development.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Parent Engagement</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Instant notifications and comprehensive reports keep parents informed and involved in their child's
                  education.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Merit Recognition</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Celebrate student achievements and positive behaviors with our comprehensive merit system.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Impact */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Students Monitored</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Schools Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Parent Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="text-center mb-12">
          <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            To become the leading global platform for educational transparency and student success, where every student
            has access to personalized support and every parent feels connected to their child's learning journey.
          </p>
        </div>

        {/* Contact Section */}
        <div className="bg-blue-600 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="text-blue-100 mb-6">
            Have questions about MwanaCheck? We'd love to hear from you and help you make the most of our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ContactUs variant="inline" size="md" />
          </div>
        </div>
      </div>
    </div>
  )
}
