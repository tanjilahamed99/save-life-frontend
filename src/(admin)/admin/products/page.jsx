import AdminOnly from "@/components/admin/AdminOnly";
import ProductsManagement from "@/components/admin/products/products-management";

export default function ProductsPage() {
  return (
    <AdminOnly>
      <ProductsManagement />
    </AdminOnly>
  );
}
