"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");
}

const schema = z.object({
  name: z.string().min(1, "نام الزامی است"),
  slug: z.string().min(1, "اسلاگ الزامی است"),
  description: z.string().optional(),
  parentId: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  discountPercent: z.coerce.number().int().min(0).max(100).optional(),
});

export type CategoryFormData = z.infer<typeof schema>;

export async function createCategory(data: CategoryFormData) {
  await requireAdmin();
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const exists = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
  if (exists) return { error: "این اسلاگ قبلاً استفاده شده است" };

  await prisma.category.create({
    data: { ...parsed.data, parentId: parsed.data.parentId || null },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, data: CategoryFormData) {
  await requireAdmin();
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const exists = await prisma.category.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (exists) return { error: "این اسلاگ قبلاً استفاده شده است" };

  await prisma.category.update({
    where: { id },
    data: { ...parsed.data, parentId: parsed.data.parentId || null },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  const children = await prisma.category.count({ where: { parentId: id } });
  if (children > 0) return { error: "ابتدا زیردسته‌ها را حذف کنید" };

  const products = await prisma.productCategory.count({ where: { categoryId: id } });
  if (products > 0) return { error: "این دسته‌بندی دارای محصول است" };

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  return { success: true };
}