"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { SAMPLE_STUDENTS } from "@/lib/data"
import { GraduationCap, BookOpen, Award, AlertTriangle, CreditCard, TrendingUp, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import { AboutFooter } from "@/components/about-footer"

export default function StudentDashboard() {
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const router = useRouter()

  // In real app, get current student's data
  const student = SAMPLE_STUDENTS[0]

  const stats = [
    {
      title: "Current GPA",
      value: student.academicPerformance.gpa.toFixed(1),
      icon: TrendingUp,
      color: "bg-blue-500",
    },
    {
      title: "Discipline Points",
      value: `${student.disciplinePoints}/100`,
      icon: Target,
      color: student.disciplinePoints >= 80 ? "bg-green-500" : "bg-red-500",
    },
    {
      title: "Total Merits",
      value: student.merits.length,
      icon: Award,
      color: "bg-yellow-500",
    },
    {
      title: "Fee Balance",
      value: `KES ${student.feeBalance.toLocaleString()}`,
      icon: CreditCard,
      color: "bg-purple-500",
    },
  ]

  const handleQuickAction = async (action: string) => {
    setLoadingAction(action)

    switch (action) {
      case "view-grades":
        await new Promise((resolve) => setTimeout(resolve, 500))
        router.push("/student/performance")
        break
      case "view-discipline":
        await new Promise((resolve) => setTimeout(resolve, 500))
        router.push("/student/discipline")
        break
      case "view-merits":
        await new Promise((resolve) => setTimeout(resolve, 500))
        router.push("/student/merits")
        break
      case "view-fees":
        await new Promise((resolve) => setTimeout(resolve, 500))
        router.push("/student/fees")
        break
    }

    setLoadingAction(null)
  }

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome back, {student.name}! Here's your academic overview</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.title} className="bg-white dark:bg-gray-800 shadow rounded-lg">
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

          {/* Academic Performance & Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  My Grades - {student.academicPerformance.term}
                </h3>
                <div className="space-y-4">
                  {student.academicPerformance.subjects.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{subject.name}</p>
                          <p className="text-sm text-gray-500">{subject.score}% Score</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            subject.score >= 80
                              ? "bg-green-100 text-green-800"
                              : subject.score >= 70
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {subject.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">Overall GPA</span>
                    <span className="text-lg font-bold text-blue-900">{student.academicPerformance.gpa}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">My Achievements & Discipline</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-green-900">Discipline Points</h4>
                      <span className="text-lg font-bold text-green-900">{student.disciplinePoints}/100</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${student.disciplinePoints}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      {student.disciplinePoints >= 80 ? "Excellent behavior!" : "Keep improving!"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Merits</h4>
                    <div className="space-y-2">
                      {student.merits.slice(0, 2).map((merit) => (
                        <div key={merit.id} className="flex items-start space-x-3 p-2 bg-yellow-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="h-6 w-6 bg-yellow-100 rounded-full flex items-center justify-center">
                              <Award className="h-3 w-3 text-yellow-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-900">{merit.title}</p>
                            <p className="text-xs text-gray-500">{merit.description}</p>
                            <p className="text-xs text-yellow-600">+{merit.points} points</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {student.disciplineHistory.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Areas for Improvement</h4>
                      <div className="space-y-2">
                        {student.disciplineHistory.slice(0, 2).map((incident) => (
                          <div key={incident.id} className="flex items-start space-x-3 p-2 bg-red-50 rounded-lg">
                            <div className="flex-shrink-0">
                              <div className="h-6 w-6 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="h-3 w-3 text-red-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-900">{incident.incident}</p>
                              <p className="text-xs text-red-600">-{incident.pointsDeducted} points</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Co-curricular Activities & Goals */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">My Activities</h3>
                <div className="space-y-3">
                  {student.coCurrenticular.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                        {activity.position && <p className="text-sm text-gray-500">Position: {activity.position}</p>}
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.performance === "Excellent"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {activity.performance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">My Goals & Progress</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Academic Goal</h4>
                    <p className="text-sm text-blue-700">Maintain GPA above 3.5</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-blue-600">
                        <span>Current: {student.academicPerformance.gpa}</span>
                        <span>Target: 3.5</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min((student.academicPerformance.gpa / 3.5) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="text-sm font-medium text-green-900 mb-2">Discipline Goal</h4>
                    <p className="text-sm text-green-700">Maintain 90+ discipline points</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-green-600">
                        <span>Current: {student.disciplinePoints}</span>
                        <span>Target: 90</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${Math.min((student.disciplinePoints / 90) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {student.feeBalance > 0 && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="text-sm font-medium text-red-900 mb-1">Fee Balance</h4>
                      <p className="text-lg font-bold text-red-900">KES {student.feeBalance.toLocaleString()}</p>
                      <p className="text-xs text-red-700 mt-1">Please remind your parents to clear the balance</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => handleQuickAction("view-grades")}
                  disabled={loadingAction === "view-grades"}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {loadingAction === "view-grades" ? "Loading..." : "View Grades"}
                </button>
                <button
                  onClick={() => handleQuickAction("view-discipline")}
                  disabled={loadingAction === "view-discipline"}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Target className="h-4 w-4 mr-2" />
                  {loadingAction === "view-discipline" ? "Loading..." : "Discipline Points"}
                </button>
                <button
                  onClick={() => handleQuickAction("view-merits")}
                  disabled={loadingAction === "view-merits"}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Award className="h-4 w-4 mr-2" />
                  {loadingAction === "view-merits" ? "Loading..." : "My Merits"}
                </button>
                <button
                  onClick={() => handleQuickAction("view-fees")}
                  disabled={loadingAction === "view-fees"}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {loadingAction === "view-fees" ? "Loading..." : "Fee Balance"}
                </button>
              </div>
            </div>
          </div>

          {/* Motivational Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-lg shadow-lg">
            <div className="px-6 py-8 text-center">
              <GraduationCap className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Keep Up the Great Work!</h3>
              <p className="text-blue-100 mb-4">
                You're doing well in your studies. Stay focused and continue working towards your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <button
                  onClick={() => handleQuickAction("view-grades")}
                  disabled={loadingAction === "view-grades"}
                  className="px-4 py-2 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingAction === "view-grades" ? "Loading..." : "View Full Report"}
                </button>
                <button className="px-4 py-2 bg-blue-700 text-white rounded-md font-medium hover:bg-blue-800 transition-colors">
                  Set New Goals
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Footer */}
      <AboutFooter />
    </ProtectedRoute>
  )
}
