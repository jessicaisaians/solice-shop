"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "نام الزامی است"),
  slug: z.string().min(1, "اسلاگ الزامی است"),
  description: z.string().optional(),
  parentId: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  discountPercent: z.coerce.number().int().min(0).max(100).optional(),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

const NO_PARENT = "__none__";

function toSlug(text: string) {
  return text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\u0600-\u06FF-]/g, "")
    .toLowerCase();
}

type Props = {
  categories: { id: string; name: string }[];
  defaultValues?: Partial<FormInput>;
  action: (data: FormOutput) => Promise<{ error: string } | void>;
  submitLabel: string;
};

export function CategoryForm({
  categories,
  defaultValues,
  action,
  submitLabel,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: { sortOrder: 0, ...defaultValues },
  });

  function onSubmit(data: FormOutput) {
    setServerError("");
    startTransition(async () => {
      const result = await action(data);
      if (result?.error) {
        setServerError(result.error);
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>نام *</Label>
            <Input
              {...register("name")}
              onBlur={(e) => {
                if (!watch("slug")) setValue("slug", toSlug(e.target.value));
              }}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            {/* slug is always LTR — it's a URL segment */}
            <Label>اسلاگ *</Label>
            <Input
              {...register("slug")}
              dir="ltr"
              className="font-mono text-left"
            />
            {errors.slug && (
              <p className="text-red-500 text-xs">{errors.slug.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>توضیحات</Label>
          <Textarea
            {...register("description")}
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>دسته‌بندی والد</Label>
            <Controller
              name="parentId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || NO_PARENT}
                  onValueChange={(v) =>
                    field.onChange(v === NO_PARENT ? "" : v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="بدون والد" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_PARENT}>بدون والد</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            {/* numbers are always LTR */}
            <Label>ترتیب نمایش</Label>
            <Input
              {...register("sortOrder")}
              type="number"
              dir="ltr"
              className="text-left"
            />
          </div>

          <div className="space-y-1.5">
            <Label>تخفیف (%)</Label>
            <Input
              {...register("discountPercent")}
              type="number"
              min="0"
              max="100"
              dir="ltr"
              className="text-left"
              placeholder="—"
            />
            {errors.discountPercent && (
              <p className="text-red-500 text-xs">
                {errors.discountPercent.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {serverError && (
        <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
          {submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          انصراف
        </Button>
      </div>
    </form>
  );
}
