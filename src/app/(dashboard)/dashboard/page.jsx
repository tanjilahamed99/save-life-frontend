import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardOverview from "@/components/dashboard/dashboard-overview";

export const metadata = {
  title: "Dashboard | Save Life",
  description: "Dashboard for Save Life",
};
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  );
}
