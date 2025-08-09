"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useSafeLanguage } from "@/lib/safe-hooks"
import { AddStudentModal } from "@/components/modals/add-student-modal"
import { AddUserModal } from "@/components/modals/add-user-modal"
import { SAMPLE_STUDENTS, SAMPLE_SCHOOLS } from "@/lib/data"
import { Users, GraduationCap, AlertTriangle, DollarSign, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { AboutFooter } from "@/components/about-footer"

export default function AdminDashboard() {
  const { t } = useSafeLanguage()

  const [showAddStudentModal, setShowAddStudentModal] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const router = useRouter()

  const totalStudents = SAMPLE_STUDENTS.length
  const totalTeachers = 5 // Mock data
  const totalParents = 3 // Mock data
  const pendingFees = SAMPLE_STUDENTS.reduce((sum, student) => sum + student.feeBalance, 0)

  const stats = [
    {
      title: t("admin.totalStudents"),
      value: totalStudents,
      icon: GraduationCap,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: t("admin.totalTeachers"),
      value: totalTeachers,
      icon: Users,
      color: "bg-green-500",
      change: "+5%",
    },
    {
      title: t("admin.pendingFees"),
      value: `KES ${pendingFees.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-yellow-500",
      change: "-8%",
    },
    {
      title: t("admin.disciplineIssues"),
      value: 3,
      icon: AlertTriangle,
      color: "bg-red-500",
      change: "-15%",
    },
  ]

  const handleQuickAction = async (action: string) => {
    setLoadingAction(action)

    switch (action) {
      case "add-user":
        setShowAddUserModal(true)
        break
      case "add-student":
        setShowAddStudentModal(true)
        break
      case "update-rules":
        // Simulate navigation delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        router.push("/admin/discipline")
        break
      case "view-reports":
        await new Promise((resolve) => setTimeout(resolve, 500))
        router.push("/admin/reports")
        break
    }

    setLoadingAction(null)
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("admin.title")}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{t("admin.overview")}</p>
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
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</div>
                            <div
                              className={`ml-2 flex items-baseline text-sm font-semibold ${
                                stat.change.startsWith("+") ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {stat.change}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  {t("admin.recentStudentActivities")}
                </h3>
                <div className="space-y-4">
                  {SAMPLE_STUDENTS.slice(0, 3).map((student) => (
                    <div key={student.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <GraduationCap className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          GPA: {student.academicPerformance.gpa} | {t("nav.discipline")}: {student.disciplinePoints}/100
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.academicPerformance.gpa >= 3.0
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {student.academicPerformance.gpa >= 3.0 ? t("status.good") : t("status.needsAttention")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  {t("admin.schoolInformation")}
                </h3>
                <div className="space-y-4">
                  {SAMPLE_SCHOOLS.map((school) => (
                    <div key={school.id}>
                      <h4 className="font-medium text-gray-900 dark:text-white">{school.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{school.address}</p>
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Discipline Rules:</h5>
                        {school.disciplineRules.slice(0, 3).map((rule, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">{rule.rule}</span>
                            <span className="text-red-600">-{rule.pointsDeducted} pts</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                {t("dashboard.quickActions")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => handleQuickAction("add-user")}
                  disabled={loadingAction === "add-user"}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Users className="h-4 w-4 mr-2" />
                  {loadingAction === "add-user" ? t("common.loading") : t("admin.addUser")}
                </button>
                <button
                  onClick={() => handleQuickAction("add-student")}
                  disabled={loadingAction === "add-student"}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {loadingAction === "add-student" ? t("common.loading") : t("admin.addStudent")}
                </button>
                <button
                  onClick={() => handleQuickAction("update-rules")}
                  disabled={loadingAction === "update-rules"}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {loadingAction === "update-rules" ? t("common.loading") : t("admin.updateRules")}
                </button>
                <button
                  onClick={() => handleQuickAction("view-reports")}
                  disabled={loadingAction === "view-reports"}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {loadingAction === "view-reports" ? t("common.loading") : t("admin.viewReports")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal isOpen={showAddUserModal} onClose={() => setShowAddUserModal(false)} />
      <AddStudentModal isOpen={showAddStudentModal} onClose={() => setShowAddStudentModal(false)} />

      {/* About Footer */}
      <AboutFooter />
    </ProtectedRoute>
  )
}
