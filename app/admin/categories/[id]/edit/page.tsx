import { prisma } from "@/lib/db";
import { updateCategory } from "@/lib/actions/categories";
import { CategoryForm } from "../../_components/category-form";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [category, categories] = await Promise.all([
    prisma.category.findUnique({ where: { id } }),
    prisma.category.findMany({
      where: { NOT: { id } },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!category) notFound();

  async function handleUpdate(data: Parameters<typeof updateCategory>[1]) {
    "use server";
    return updateCategory(id, data);
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-stone-900 mb-6">
        ویرایش: {category.name}
      </h1>
      <CategoryForm
        categories={categories}
        defaultValues={{
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          parentId: category.parentId ?? "",
          sortOrder: category.sortOrder,
          discountPercent: category.discountPercent ?? undefined,
        }}
        action={handleUpdate}
        submitLabel="ذخیره تغییرات"
      />
    </div>
  );
}
