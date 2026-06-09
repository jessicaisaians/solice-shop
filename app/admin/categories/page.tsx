import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CategoryTree } from "./_components/category-tree";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      _count: { select: { products: true } },
      children: {
        include: {
          _count: { select: { products: true } },
          children: {
            include: { _count: { select: { products: true } }, children: true },
          },
        },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-stone-900">دسته‌بندی‌ها</h1>
          <p className="text-sm text-stone-400 mt-0.5">
            مدیریت دسته‌بندی محصولات
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          دسته‌بندی جدید
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <p className="text-sm">هنوز دسته‌بندی‌ای اضافه نشده است</p>
          <Link
            href="/admin/categories/new"
            className="mt-3 text-sm text-stone-900 underline"
          >
            اولین دسته‌بندی را بسازید
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50 text-right">
                <th className="font-medium text-stone-500 px-4 py-3">نام</th>
                <th className="font-medium text-stone-500 px-4 py-3">اسلاگ</th>
                <th className="font-medium text-stone-500 px-4 py-3">
                  محصولات
                </th>
                <th className="font-medium text-stone-500 px-4 py-3">تخفیف</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              <CategoryTree categories={categories} depth={0} />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
