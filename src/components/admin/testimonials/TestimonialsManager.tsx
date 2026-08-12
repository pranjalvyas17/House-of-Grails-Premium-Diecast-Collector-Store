"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, MoreHorizontal, Pencil, Trash2, Star, Save, Loader2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FormField } from "@/components/admin/form/FormField";
import { SingleImageUpload } from "@/components/admin/form/SingleImageUpload";
import { testimonialSchema, type TestimonialFormValues } from "@/lib/admin/schemas";
import { createTestimonialAction, updateTestimonialAction, deleteTestimonialAction } from "@/lib/admin/actions/testimonialActions";
import { uploadImageAction } from "@/lib/admin/actions/mediaActions";
import type { Testimonial } from "@/lib/admin/types";

const emptyValues: TestimonialFormValues = {
  name: "",
  handle: "",
  quote: "",
  avatarUrl: "",
  collectionSize: "",
  featured: false,
};

export function TestimonialsManager({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestimonialFormValues>({ resolver: zodResolver(testimonialSchema), defaultValues: emptyValues });

  const openCreate = () => {
    setEditing(null);
    reset(emptyValues);
    setDialogOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    reset({
      name: t.name,
      handle: t.handle,
      quote: t.quote,
      avatarUrl: t.avatarUrl,
      collectionSize: t.collectionSize,
      featured: t.featured,
    });
    setDialogOpen(true);
  };

  const onSubmit = (values: TestimonialFormValues) => {
    startTransition(async () => {
      if (editing) {
        const updated = await updateTestimonialAction(editing.id, values);
        if (updated) setTestimonials((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        toast.success("Testimonial updated");
      } else {
        const created = await createTestimonialAction(values);
        setTestimonials((prev) => [created, ...prev]);
        toast.success("Testimonial added");
      }
      setDialogOpen(false);
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    startTransition(async () => {
      const ok = await deleteTestimonialAction(target.id);
      if (ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== target.id));
        toast.success("Testimonial deleted");
      }
      setDeleteTarget(null);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-admin text-2xl font-semibold tracking-tight">Testimonials</h1>
          <p className="text-sm text-muted-foreground">{testimonials.length} testimonials</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} /> Add Testimonial
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
          <Quote size={28} />
          <p className="text-sm">No testimonials yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.id} className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.avatarUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-medium">
                      {t.name}
                      {t.featured && <Star size={12} className="fill-primary text-primary" />}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.handle}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon-sm" nativeButton>
                        <MoreHorizontal size={15} />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(t)}>
                      <Pencil size={14} /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(t)}>
                      <Trash2 size={14} /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="line-clamp-3 text-sm text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-xs text-muted-foreground">{t.collectionSize}</p>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit testimonial" : "Add testimonial"}</DialogTitle>
              <DialogDescription>Shown in the homepage testimonials carousel.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Name" htmlFor="t-name" required error={errors.name?.message}>
                  <Input id="t-name" {...register("name")} />
                </FormField>
                <FormField label="Handle" htmlFor="t-handle" required error={errors.handle?.message}>
                  <Input id="t-handle" placeholder="@handle" {...register("handle")} />
                </FormField>
              </div>
              <FormField label="Quote" htmlFor="t-quote" required error={errors.quote?.message}>
                <Textarea id="t-quote" rows={3} {...register("quote")} />
              </FormField>
              <FormField label="Collection size" htmlFor="t-collection" required error={errors.collectionSize?.message} hint="e.g. '142 pieces'">
                <Input id="t-collection" {...register("collectionSize")} />
              </FormField>

              <Controller
                control={control}
                name="avatarUrl"
                render={({ field }) => (
                  <div>
                    <p className="mb-1.5 text-sm font-medium">Avatar</p>
                    <SingleImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      onUpload={(file) => uploadImageAction(file, "testimonials")}
                      label="Upload avatar"
                      aspect="square"
                      className="w-24"
                    />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="featured"
                render={({ field }) => (
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm font-medium">Featured</span>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {editing ? "Save changes" : "Add testimonial"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this testimonial?</AlertDialogTitle>
            <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
