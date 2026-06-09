import { Pencil } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";
import { DeleteCategoryButton } from "./delete-button";

type Category = {
  id: string;
  name: string;
  slug: string;
  discountPercent: number | null;
  _count: { products: number };
  children: Category[];
};

export function CategoryTree({
  categories,
  depth,
}: {
  categories: Category[];
  depth: number;
}) {
  return (
    <>
      {categories.map((cat) => (
        <Fragment key={cat.id}>
          <tr
            key={cat.id}
            className="border-b border-stone-100 hover:bg-stone-50"
          >
            <td className="px-4 py-3">
              <span
                className="flex items-center gap-1.5"
                style={{ paddingRight: `${depth * 20}px` }}
              >
                {depth > 0 && <span className="text-stone-300 text-xs">└</span>}
                <span className="font-medium text-stone-900">{cat.name}</span>
              </span>
            </td>
            <td className="px-4 py-3 font-mono text-xs text-stone-400">
              {cat.slug}
            </td>
            <td className="px-4 py-3 text-stone-600">{cat._count.products}</td>
            <td className="px-4 py-3 text-stone-600">
              {cat.discountPercent ? `${cat.discountPercent}٪` : "—"}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1 justify-end">
                <Link
                  href={`/admin/categories/${cat.id}/edit`}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
                <DeleteCategoryButton
                  id={cat.id}
                  name={cat.name}
                  hasChildren={cat.children.length > 0}
                />
              </div>
            </td>
          </tr>
          {cat.children.length > 0 && (
            <CategoryTree categories={cat.children} depth={depth + 1} />
          )}
        </Fragment>
      ))}
    </>
  );
}
