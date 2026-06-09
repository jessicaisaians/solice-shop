"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteCategory } from "@/lib/actions/categories";
import { toast } from "sonner";

export function DeleteCategoryButton({
  id,
  name,
  hasChildren,
}: {
  id: string;
  name: string;
  hasChildren: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`دسته‌بندی "${name}" حذف شود؟`)) return;
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result?.error) toast.error(result.error);
      else toast.success("دسته‌بندی حذف شد");
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending || hasChildren}
      title={hasChildren ? "ابتدا زیردسته‌ها را حذف کنید" : "حذف"}
      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
