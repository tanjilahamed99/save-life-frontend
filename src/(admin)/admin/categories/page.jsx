import AdminOnly from "@/components/admin/AdminOnly";
import CategoriesManagement from "@/components/admin/categories/category-management";

export default function CategoryPage() {
  return (
    <AdminOnly>
      <CategoriesManagement />
    </AdminOnly>
  );
}
