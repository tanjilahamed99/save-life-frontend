import AdminOnly from "@/components/admin/AdminOnly";
import CustomersManagement from "@/components/admin/customers/customers-management";

export default function CustomersPage() {
  return (
    <AdminOnly>
      <CustomersManagement />
    </AdminOnly>
  );
}
