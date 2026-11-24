import DashboardShell from "@/components/dashboard/DashboardShell";

export default function AdminDashboard() {
  return (
    <DashboardShell
      role="Admin"
      name="System Administrator"
      navigation={[
        "Dashboard",
        "Students",
        "Staff",
        "Courses",
        "Batches",
        "Enrollments",
        "Attendance",
        "Certificates",
        "Reports",
        "Audit Logs",
        "Settings",
      ]}
      stats={[
        ["Total Students", "—", "Active records"],
        ["Active Staff", "—", "Assigned personnel"],
        ["Active Courses", "—", "Published courses"],
        ["Pending Actions", "—", "Enrollments & reviews"],
      ]}
    />
  );
}
