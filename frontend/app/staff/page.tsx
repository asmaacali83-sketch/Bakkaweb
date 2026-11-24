import DashboardShell from "@/components/dashboard/DashboardShell";

export default function StaffDashboard() {
  return (
    <DashboardShell
      role="Staff"
      name="Training Staff"
      navigation={[
        "Dashboard",
        "My Courses",
        "My Students",
        "Attendance",
        "Progress",
        "Profile",
      ]}
      stats={[
        ["Assigned Batches", "—", "Current assignments"],
        ["Assigned Students", "—", "Across your batches"],
        ["Upcoming Sessions", "—", "Next 7 days"],
        ["Attendance Tasks", "—", "Awaiting completion"],
      ]}
    />
  );
}
