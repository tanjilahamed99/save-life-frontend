import DashboardLayout from "@/components/dashboard/dashboard-layout";
import AccountDetails from "@/components/dashboard/account-details";

export const metadata = {
  title: "Account | Save Life",
  description: "Manage your account settings",
};

export default function AccountPage() {
  return (
    <DashboardLayout>
      <AccountDetails />
    </DashboardLayout>
  );
}
