"use client"

// Simple translation function - English only, no theme context
export function useSafeLanguage() {
  const translations: Record<string, string> = {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.students": "Students",
    "nav.performance": "Performance",
    "nav.discipline": "Discipline",
    "nav.fees": "Fees",
    "nav.payments": "Payments",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    "nav.login": "Sign In",
    "nav.signup": "Sign Up",
    "nav.welcome": "Welcome",
    "nav.contactUs": "Contact Us",
    "nav.features": "Features",
    "nav.benefits": "Benefits",
    "nav.howItWorks": "How It Works",
    "nav.about": "About",

    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.add": "Add",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.export": "Export",
    "common.print": "Print",
    "common.close": "Close",
    "common.submit": "Submit",
    "common.reset": "Reset",
    "common.confirm": "Confirm",
    "common.yes": "Yes",
    "common.no": "No",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.overview": "Overview",
    "dashboard.recentActivities": "Recent Activities",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.stats": "Statistics",

    // Admin Dashboard
    "admin.title": "Admin Dashboard",
    "admin.overview": "Overview of school management and statistics",
    "admin.totalStudents": "Total Students",
    "admin.totalTeachers": "Total Teachers",
    "admin.pendingFees": "Pending Fees",
    "admin.disciplineIssues": "Discipline Issues",
    "admin.addUser": "Add User",
    "admin.addStudent": "Add Student",
    "admin.updateRules": "Update Rules",
    "admin.viewReports": "View Reports",
    "admin.recentStudentActivities": "Recent Student Activities",
    "admin.schoolInformation": "School Information",

    // Teacher Dashboard
    "teacher.title": "Teacher Dashboard",
    "teacher.overview": "Manage your students' performance and activities",
    "teacher.myStudents": "My Students",
    "teacher.classAverageGPA": "Class Average GPA",
    "teacher.meritsAwarded": "Merits Awarded",
    "teacher.disciplineReports": "Discipline Reports",
    "teacher.updateGrades": "Update Grades",
    "teacher.awardMerit": "Award Merit",
    "teacher.reportIncident": "Report Incident",
    "teacher.viewStudents": "View All Students",
    "teacher.studentPerformance": "Student Performance",

    // Parent Dashboard
    "parent.title": "Parent Dashboard",
    "parent.overview": "Monitor your child's academic progress and activities",
    "parent.currentGPA": "Current GPA",
    "parent.disciplinePoints": "Discipline Points",
    "parent.meritsEarned": "Merits Earned",
    "parent.feeBalance": "Fee Balance",
    "parent.academicPerformance": "Academic Performance",
    "parent.recentMerits": "Recent Merits & Activities",
    "parent.coCurricularActivities": "Co-curricular Activities",
    "parent.feeInformation": "Fee Information",
    "parent.outstandingBalance": "Outstanding Balance",
    "parent.payViaMpesa": "Pay via M-Pesa",
    "parent.setPaymentPlan": "Set Payment Plan",
    "parent.viewPerformance": "View Performance",
    "parent.viewDiscipline": "View Discipline",
    "parent.payFees": "Pay Fees",
    "parent.paymentPlan": "Payment Plan",

    // Student Dashboard
    "student.title": "My Dashboard",
    "student.overview": "Welcome back! Here's your academic overview",
    "student.myGrades": "My Grades",
    "student.myAchievements": "My Achievements & Discipline",
    "student.myActivities": "My Activities",
    "student.myGoals": "My Goals & Progress",
    "student.academicGoal": "Academic Goal",
    "student.disciplineGoal": "Discipline Goal",
    "student.maintainGPA": "Maintain GPA above 3.5",
    "student.maintainDiscipline": "Maintain 90+ discipline points",
    "student.viewGrades": "View Grades",
    "student.disciplinePoints": "Discipline Points",
    "student.myMerits": "My Merits",
    "student.keepUpWork": "Keep Up the Great Work!",
    "student.doingWell": "You're doing well in your studies. Stay focused and continue working towards your goals.",
    "student.viewFullReport": "View Full Report",
    "student.setNewGoals": "Set New Goals",

    // Forms
    "form.name": "Name",
    "form.email": "Email",
    "form.password": "Password",
    "form.confirmPassword": "Confirm Password",
    "form.role": "Role",
    "form.schoolName": "School Name",
    "form.phoneNumber": "Phone Number",
    "form.address": "Address",

    // Roles
    "role.admin": "Administrator",
    "role.teacher": "Teacher",
    "role.parent": "Parent",
    "role.student": "Student",

    // Subjects
    "subject.mathematics": "Mathematics",
    "subject.english": "English",
    "subject.science": "Science",
    "subject.history": "History",
    "subject.geography": "Geography",
    "subject.kiswahili": "Kiswahili",

    // Status
    "status.excellent": "Excellent",
    "status.good": "Good",
    "status.needsAttention": "Needs Attention",
    "status.needsHelp": "Needs Help",

    // Contact
    "contact.sendEmail": "Send Email",
    "contact.callNow": "Call Now",
    "contact.emailSupport": "Email Support",
    "contact.callSupport": "Call Support",
    "contact.needHelp": "Need Help?",
    "contact.getInTouch": "Get in touch with our support team for assistance.",

    // About
    "about.title": "About MwanaCheck",
    "about.mission": "Our Mission",
    "about.vision": "Our Vision",
    "about.impact": "Our Impact",
    "about.learnMore": "Learn More",
  }

  const t = (key: string, params?: Record<string, string>) => {
    let translation = translations[key] || key

    // Simple parameter replacement
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, value)
      })
    }

    return translation
  }

  return {
    language: "en" as const,
    toggleLanguage: () => {}, // No-op function
    setLanguage: () => {}, // No-op function
    t,
  }
}
