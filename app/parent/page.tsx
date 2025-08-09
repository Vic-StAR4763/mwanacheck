"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { PaymentModal } from "@/components/modals/payment-modal"
import { SAMPLE_STUDENTS } from "@/lib/data"
import { BookOpen, Award, AlertTriangle, CreditCard, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { AboutFooter } from "@/components/about-footer"

export default function ParentDashboard() {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const router = useRouter()

  // In real app, get student linked to this parent
  const myChild = SAMPLE_STUDENTS[0]

  const stats = [
    {
      title: "Current GPA",
      value: myChild.academicPerformance.gpa.toFixed(1),
      icon: TrendingUp,
      color: "bg-blue-500",
    },
    {
      title: "Discipline Points",
      value: `${myChild.disciplinePoints}/100`,
      icon: AlertTriangle,
      color: myChild.disciplinePoints >= 80 ? "bg-green-500" : "bg-red-500",
    },
    {
      title: "Merits Earned",
      value: myChild.merits.length,
      icon: Award,
      color: "bg-yellow-500",
    },
    {
      title: "Fee Balance",
      value: `KES ${myChild.feeBalance.toLocaleString()}`,
      icon: CreditCard,
      color: "bg-purple-500",
    },
  ]

  const handleQuickAction = async (action: string) => {
    setLoadingAction(action)

    switch (action) {
      case "view-performance":
        await new Promise((resolve) => setTimeout(resolve, 500))
        router.push("/parent/performance")
        break
      case "view-discipline":
        await new Promise((resolve) => setTimeout(resolve, 500))
        router.push("/parent/discipline")
        break
      case "pay-fees":
        setShowPaymentModal(true)
        break
      case "payment-plan":
        await new Promise((resolve) => setTimeout(resolve, 500))
        router.push("/parent/payments")
        break
    }

    setLoadingAction(null)
  }

  return (
    <ProtectedRoute allowedRoles={["parent"]}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Parent Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Monitor {myChild.name}'s academic progress and activities
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.title} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`${stat.color} p-3 rounded-md`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            {stat.title}
                          </dt>
                          <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Academic Performance & Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  Academic Performance
                </h3>
                <div className="space-y-4">
                  {myChild.academicPerformance.subjects.map((subject, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{subject.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Score: {subject.score}%</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          subject.score >= 80
                            ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                            : subject.score >= 70
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                              : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"
                        }`}
                      >
                        {subject.grade}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  Recent Merits & Activities
                </h3>
                <div className="space-y-4">
                  {myChild.merits.map((merit) => (
                    <div key={merit.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Award className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{merit.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{merit.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Awarded by {merit.awardedBy} on {new Date(merit.date).toLocaleDateString()}
                          </p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100">
                            +{merit.points} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {myChild.disciplineHistory.map((incident) => (
                    <div key={incident.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Discipline Report</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{incident.incident}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Reported by {incident.reportedBy} on {new Date(incident.date).toLocaleDateString()}
                          </p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100">
                            -{incident.pointsDeducted} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Co-curricular Activities & Fee Information */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  Co-curricular Activities
                </h3>
                <div className="space-y-3">
                  {myChild.coCurrenticular.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.activity}</p>
                        {activity.position && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">Position: {activity.position}</p>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.performance === "Excellent"
                            ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100"
                        }`}
                      >
                        {activity.performance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">Fee Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-700 rounded-lg border border-red-200">
                    <div>
                      <p className="text-sm font-medium text-red-900 dark:text-red-100">Outstanding Balance</p>
                      <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                        KES {myChild.feeBalance.toLocaleString()}
                      </p>
                    </div>
                    <CreditCard className="h-8 w-8 text-red-600" />
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleQuickAction("pay-fees")}
                      disabled={loadingAction === "pay-fees"}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-green-500 dark:hover:bg-green-600"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {loadingAction === "pay-fees" ? "Loading..." : "Pay via M-Pesa"}
                    </button>
                    <button
                      onClick={() => handleQuickAction("payment-plan")}
                      disabled={loadingAction === "payment-plan"}
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      {loadingAction === "payment-plan" ? "Loading..." : "Set Payment Plan"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => handleQuickAction("view-performance")}
                  disabled={loadingAction === "view-performance"}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {loadingAction === "view-performance" ? "Loading..." : "View Performance"}
                </button>
                <button
                  onClick={() => handleQuickAction("view-discipline")}
                  disabled={loadingAction === "view-discipline"}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {loadingAction === "view-discipline" ? "Loading..." : "View Discipline"}
                </button>
                <button
                  onClick={() => handleQuickAction("pay-fees")}
                  disabled={loadingAction === "pay-fees"}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {loadingAction === "pay-fees" ? "Loading..." : "Pay Fees"}
                </button>
                <button
                  onClick={() => handleQuickAction("payment-plan")}
                  disabled={loadingAction === "payment-plan"}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {loadingAction === "payment-plan" ? "Loading..." : "Payment Plan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} amount={myChild.feeBalance} />

      {/* About Footer */}
      <AboutFooter />
    </ProtectedRoute>
  )
}
