"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ContactUs } from "@/components/contact-us"
import {
  ArrowRight,
  CheckCircle,
  Users,
  BookOpen,
  Shield,
  Smartphone,
  TrendingUp,
  Award,
  Bell,
  CreditCard,
  BarChart3,
  Star,
  Play,
  Globe,
  Zap,
  Target,
  Lightbulb,
  Palette,
  Monitor,
  MessageCircle,
  BarChart,
} from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for authenticated user without using useAuth hook
    try {
      const storedUser = localStorage.getItem("mwanacheck_user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)

        // Redirect authenticated users to their dashboards
        switch (parsedUser.role) {
          case "admin":
            router.push("/admin")
            break
          case "teacher":
            router.push("/teacher")
            break
          case "parent":
            router.push("/parent")
            break
          case "student":
            router.push("/student")
            break
        }
      }
    } catch (error) {
      console.error("Error checking auth:", error)
    } finally {
      setLoading(false)
    }
  }, [router])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show loading while redirecting authenticated users
  if (user && user.role !== "guest") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Trusted by 50,000+ Students Worldwide
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Every Student
              </span>
              <br />
              Deserves to Thrive
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              MwanaCheck connects students, parents, and educators through intelligent monitoring, instant alerts, and
              data-driven insights that transform academic success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/signup"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                No setup fees
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Mobile-first design
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Global accessibility
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600 dark:text-gray-400">Students Monitored</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600 dark:text-gray-400">Parent Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">Real-time Monitoring</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">15+</div>
              <div className="text-gray-600 dark:text-gray-400">Counties Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features, <span className="text-blue-600">Simple Experience</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to monitor, support, and celebrate student success in one intelligent platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Academic Performance Tracking",
                description:
                  "Real-time grade monitoring with predictive analytics to identify at-risk students before they fall behind.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Shield,
                title: "Smart Discipline System",
                description:
                  "Point-based behavioral tracking that promotes positive reinforcement and helps students build character.",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: Smartphone,
                title: "Mobile Money Integration",
                description:
                  "Seamless fee payments through local mobile money services, making education accessible to all families.",
                color: "from-green-500 to-green-600",
              },
              {
                icon: Bell,
                title: "Instant Alerts",
                description:
                  "Parents receive immediate notifications about grades, attendance, behavior, and important school updates.",
                color: "from-orange-500 to-orange-600",
              },
              {
                icon: Award,
                title: "Scholarship Access",
                description:
                  "AI-powered matching connects deserving students with scholarship opportunities based on their performance.",
                color: "from-pink-500 to-pink-600",
              },
              {
                icon: BarChart3,
                title: "Co-curricular Tracking",
                description:
                  "Monitor sports, clubs, and extracurricular activities to celebrate well-rounded student development.",
                color: "from-indigo-500 to-indigo-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl dark:shadow-gray-900/25 transition-all duration-300 p-6"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Built for <span className="text-purple-600">Everyone</span> in Education
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              MwanaCheck serves every stakeholder in the educational ecosystem with tailored experiences and insights.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {[
              {
                title: "For Students",
                icon: Users,
                color: "blue",
                description: "Take control of your academic journey with real-time insights and goal tracking.",
                benefits: [
                  "Track your grades and progress in real-time",
                  "Set and monitor personal academic goals",
                  "Access scholarship opportunities automatically",
                  "Build positive behavioral patterns with point rewards",
                ],
              },
              {
                title: "For Parents",
                icon: Users,
                color: "purple",
                description: "Stay connected to your child's education with instant updates and easy communication.",
                benefits: [
                  "Receive instant alerts about grades and behavior",
                  "Pay school fees easily with mobile money",
                  "Monitor co-curricular activities and achievements",
                  "Access detailed progress reports and analytics",
                ],
              },
              {
                title: "For Teachers",
                icon: BookOpen,
                color: "green",
                description: "Streamline data entry and focus more time on teaching with intelligent automation.",
                benefits: [
                  "Quick and easy grade entry with mobile app",
                  "Automated parent notifications and updates",
                  "Identify at-risk students with predictive analytics",
                  "Track behavioral patterns and interventions",
                ],
              },
              {
                title: "For Administrators",
                icon: BarChart3,
                color: "orange",
                description: "Make data-driven decisions with comprehensive analytics and policy management tools.",
                benefits: [
                  "Comprehensive school-wide analytics dashboard",
                  "Flexible policy management and customization",
                  "Financial tracking and fee collection insights",
                  "Multi-campus management and reporting",
                ],
              },
            ].map((role, index) => (
              <div
                key={index}
                className={`border-2 border-${role.color}-200 bg-gradient-to-br from-${role.color}-50 to-white dark:from-gray-800 dark:to-gray-900 dark:border-${role.color}-700 rounded-xl p-8`}
              >
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 bg-${role.color}-600 rounded-full flex items-center justify-center mr-4`}>
                    <role.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold text-${role.color}-900 dark:text-${role.color}-200`}>
                      {role.title}
                    </h3>
                    <p className={`text-${role.color}-700 dark:text-${role.color}-400 mt-1`}>{role.description}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {role.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-start">
                      <CheckCircle
                        className={`h-5 w-5 text-${role.color}-600 dark:text-${role.color}-400 mt-0.5 mr-3 flex-shrink-0`}
                      />
                      <span className={`text-${role.color}-800 dark:text-${role.color}-300`}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How <span className="text-blue-600">MwanaCheck</span> Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Get started in minutes with our simple three-step process that transforms how schools manage student
              success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Quick Setup",
                description:
                  "Create your school account and invite teachers, parents, and students to join the platform.",
                icon: Target,
              },
              {
                step: "02",
                title: "Start Monitoring",
                description:
                  "Teachers input grades and activities while the system automatically tracks progress and sends alerts.",
                icon: TrendingUp,
              },
              {
                step: "03",
                title: "See Results",
                description:
                  "Watch student performance improve with data-driven insights and engaged parent participation.",
                icon: Award,
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform -translate-y-1/2"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots/Visuals Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              See MwanaCheck in <span className="text-purple-600">Action</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Experience the intuitive interface that makes student monitoring simple and effective for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Real-time Dashboard</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Live grade updates and progress tracking</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Instant notifications and alerts</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Comprehensive analytics and insights</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 text-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Image
                      src="/mwanacheck-logo.png"
                      alt="MwanaCheck Logo"
                      width={32}
                      height={32}
                      className="h-8 w-auto object-contain mr-3"
                    />
                    <span className="font-semibold text-gray-900 dark:text-white">Student Dashboard</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Live Preview</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-800 dark:text-gray-200">Mathematics</span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">A (85%)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-800 dark:text-gray-200">English</span>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">B+ (78%)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-800 dark:text-gray-200">Science</span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">A- (82%)</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Interactive dashboard preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Globe className="h-16 w-16 text-blue-200 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6">About MwanaCheck</h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Founded by Victor Manee and team, MwanaCheck was born from the belief that every student deserves
              personalized attention and support. Our platform bridges the gap between schools, parents, and students,
              creating a collaborative ecosystem focused on academic success and character development.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-200 mb-2">2025</div>
              <div className="text-blue-100">Founded</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-200 mb-2">500+</div>
              <div className="text-blue-100">Schools Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-200 mb-2">15+</div>
              <div className="text-blue-100">Counties</div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-blue-100 mb-8 max-w-3xl mx-auto">
              From schools in Kenya to academies in East Africa and beyond, MwanaCheck adapts to local needs while
              maintaining global standards. Join thousands of educators worldwide who trust us to help their students
              thrive.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Meet the Founders Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Meet the <span className="text-blue-600">Founders</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              The visionary minds behind MwanaCheck, dedicated to transforming education through technology and
              innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Victor Manee",
                role: "CEO & Founder",
                tagline: "Visionary leader passionate about education and technology innovation",
                image: "/victor-manee.jpg",
                icon: Lightbulb,
                color: "from-blue-500 to-blue-600",
              },
              {
                name: "Isaac Maloba",
                role: "UI/UX Designer & Founder",
                tagline: "Creative designer crafting intuitive experiences for educational excellence",
                image: "/placeholder-user.jpg",
                icon: Palette,
                color: "from-purple-500 to-purple-600",
              },
              {
                name: "Darren Fadhili",
                role: "Front-End Developer & Co-Founder",
                tagline: "Technical innovator building seamless user interfaces for modern education",
                image: "/placeholder-user.jpg",
                icon: Monitor,
                color: "from-green-500 to-green-600",
              },
              {
                name: "Andreane Kaniaru",
                role: "Chief Financial Officer & Co-Founder",
                tagline:
                  "Financial strategist ensuring sustainable growth and resource optimization for educational excellence",
                image: "/andreane-kaniaru-new.jpg",
                icon: CreditCard,
                color: "from-orange-500 to-orange-600",
              },
              {
                name: "James Gichaga",
                role: "Chief Consultant & Co-Founder",
                tagline: "Strategic advisor guiding educational transformation and institutional growth",
                image: "/placeholder-user.jpg",
                icon: MessageCircle,
                color: "from-pink-500 to-pink-600",
              },
              {
                name: "Jackson Kagema",
                role: "Market Officer & Co-Founder",
                tagline: "Market strategist expanding MwanaCheck's reach across educational institutions",
                image: "/jackson-kagema.jpg",
                icon: BarChart,
                color: "from-indigo-500 to-indigo-600",
              },
            ].map((founder, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-gray-900/25 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                {/* Full Photo */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={founder.image || "/placeholder.svg"}
                    alt={founder.name}
                    width={400}
                    height={256}
                    className={`w-full h-full transition-transform duration-500 ${
                      founder.name === "Andreane Kaniaru"
                        ? "object-cover object-center scale-130 group-hover:scale-120"
                        : "object-cover object-top scale-110 group-hover:scale-100"
                    }`}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  {/* Icon overlay */}
                  <div
                    className={`absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br ${founder.color} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <founder.icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Name and Role */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {founder.name}
                    </h3>
                    <p
                      className={`text-sm font-medium bg-gradient-to-r ${founder.color} bg-clip-text text-transparent`}
                    >
                      {founder.role}
                    </p>
                  </div>

                  {/* Tagline */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">{founder.tagline}</p>

                  {/* Decorative element */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div
                      className={`w-12 h-1 bg-gradient-to-r ${founder.color} rounded-full opacity-60 group-hover:opacity-100 transition-opacity`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional info */}
          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our diverse team combines expertise in education, technology, design, and business strategy to create
              solutions that truly make a difference in students' lives across Africa and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Join thousands of schools worldwide that trust MwanaCheck to monitor, support, and celebrate student
            success.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Free 30-Day Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <ContactUs variant="button" size="lg" showBoth={false} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-2" />
              4.9/5 rating from 2,000+ schools
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-green-500 mr-2" />
              GDPR & FERPA compliant
            </div>
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 text-blue-500 mr-2" />
              No credit card required
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Image
                  src="/mwanacheck-logo.png"
                  alt="MwanaCheck Logo"
                  width={32}
                  height={32}
                  className="h-8 w-auto object-contain mr-2 brightness-0 invert"
                />
                <span className="font-bold text-xl">MwanaCheck</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering every student to reach their full potential through intelligent monitoring and support.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link href="#features" className="block hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="#benefits" className="block hover:text-white transition-colors">
                  Benefits
                </Link>
                <Link href="/login" className="block hover:text-white transition-colors">
                  Pricing
                </Link>
                <Link href="/login" className="block hover:text-white transition-colors">
                  Security
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link href="/login" className="block hover:text-white transition-colors">
                  Help Center
                </Link>
                <ContactUs variant="button" size="sm" showBoth={false} className="text-left" />
                <Link href="/login" className="block hover:text-white transition-colors">
                  Training
                </Link>
                <Link href="/login" className="block hover:text-white transition-colors">
                  Community
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link href="/about" className="block hover:text-white transition-colors">
                  About Us
                </Link>
                <Link href="/login" className="block hover:text-white transition-colors">
                  Careers
                </Link>
                <Link href="/login" className="block hover:text-white transition-colors">
                  Press
                </Link>
                <Link href="/login" className="block hover:text-white transition-colors">
                  Partners
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">© 2025 MwanaCheck. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-400 mt-4 sm:mt-0">
              <Link href="/login" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/login" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/login" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Contact Button */}
      <ContactUs variant="floating" />
    </div>
  )
}
