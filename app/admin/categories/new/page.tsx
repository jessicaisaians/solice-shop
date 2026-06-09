import { createCategory } from "@/lib/actions/categories";
import { prisma } from "@/lib/db";
import { CategoryForm } from "../_components/category-form";

export default async function NewCategoryPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold text-stone-900 mb-6">
        دسته‌بندی جدید
      </h1>
      <CategoryForm
        categories={categories}
        action={createCategory}
        submitLabel="ایجاد دسته‌بندی"
      />
    </div>
  );
}
