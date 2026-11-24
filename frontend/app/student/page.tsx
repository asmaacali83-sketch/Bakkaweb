import DashboardShell from "@/components/dashboard/DashboardShell";

export default function StudentDashboard() {
  return (
    <DashboardShell
      role="Student"
      name="Student Workspace"
      navigation={[
        "Dashboard",
        "My Profile",
        "My Courses",
        "Schedule",
        "Attendance",
        "Progress",
        "Certificates",
      ]}
      stats={[
        ["Current Courses", "—", "Active enrollments"],
        ["Attendance", "—", "Overall record"],
        ["Progress", "—", "Completed work"],
        ["Certificates", "—", "Issued to you"],
      ]}
    />
  );
}
