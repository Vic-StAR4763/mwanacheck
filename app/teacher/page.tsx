"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DisciplineModal } from "@/components/modals/discipline-modal"
import { AwardMeritModal } from "@/components/modals/award-merit-modal"
import { SAMPLE_STUDENTS } from "@/lib/data"
import { GraduationCap, BookOpen, Award, AlertTriangle, TrendingUp, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { AboutFooter } from "@/components/about-footer"

export default function TeacherDashboard() {
  const [showDisciplineModal, setShowDisciplineModal] = useState(false)
  const [showMeritModal, setShowMeritModal] = useState(false)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const router = useRouter()

  const myStudents = SAMPLE_STUDENTS // In real app, filter by teacher's class
  const averageGPA = myStudents.reduce((sum, student) => sum + student.academicPerformance.gpa, 0) / myStudents.length
  const totalMeritsAwarded = myStudents.reduce((sum, student) => sum + student.merits.length, 0)
  const disciplineIssues = myStudents.reduce((sum, student) => sum + student.disciplineHistory.length, 0)

  const stats = [
    {
      title: "My Students",
      value: myStudents.length,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Class Average GPA",
      value: averageGPA.toFixed(1),
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Merits Awarded",
      value: totalMeritsAwarded,
      icon: Award,
      color: "bg-yellow-500",
    },
    {
      title: "Discipline Reports",
      value: disciplineIssues,
      icon: AlertTriangle,
      color: "bg-red-500",
    },
  ]

  const handleQuickAction = async (action: string) => {
    setLoadingAction(action)

    switch (action) {
      case "update-grades":
        await new Promise((resolve) => setTimeout(resolve, 500))
        router.push("/teacher/performance")
        break
      case "award-merit":
        setShowMeritModal(true)
        break
      case "report-incident":
        setShowDisciplineModal(true)
        break
      case "view-students":
        await new Promise((resolve) => setTimeout(resolve, 500))
        router.push("/teacher/students")
        break
    }

    setLoadingAction(null)
  }

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teacher Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Manage your students' performance and activities</p>
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
                          <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                          <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Student Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Student Performance</h3>
                <div className="space-y-4">
                  {myStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <GraduationCap className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{student.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            GPA: {student.academicPerformance.gpa}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.academicPerformance.gpa >= 3.0
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {student.academicPerformance.gpa >= 3.0 ? "Excellent" : "Needs Help"}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.disciplinePoints >= 80 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.disciplinePoints}/100 pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activities</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Merit Awarded</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Alice Student - Academic Excellence</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Grade Updated</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mathematics test scores entered</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">1 day ago</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Discipline Report</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Late to class incident reported</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">3 days ago</p>
                    </div>
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
                  onClick={() => handleQuickAction("update-grades")}
                  disabled={loadingAction === "update-grades"}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {loadingAction === "update-grades" ? "Loading..." : "Update Grades"}
                </button>
                <button
                  onClick={() => handleQuickAction("award-merit")}
                  disabled={loadingAction === "award-merit"}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Award className="h-4 w-4 mr-2" />
                  {loadingAction === "award-merit" ? "Loading..." : "Award Merit"}
                </button>
                <button
                  onClick={() => handleQuickAction("report-incident")}
                  disabled={loadingAction === "report-incident"}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {loadingAction === "report-incident" ? "Loading..." : "Report Incident"}
                </button>
                <button
                  onClick={() => handleQuickAction("view-students")}
                  disabled={loadingAction === "view-students"}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Users className="h-4 w-4 mr-2" />
                  {loadingAction === "view-students" ? "Loading..." : "View All Students"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DisciplineModal isOpen={showDisciplineModal} onClose={() => setShowDisciplineModal(false)} />
      <AwardMeritModal isOpen={showMeritModal} onClose={() => setShowMeritModal(false)} />

      {/* About Footer */}
      <AboutFooter />
    </ProtectedRoute>
  )
}
