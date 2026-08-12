"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField } from "@/components/admin/form/FormField";
import { SingleImageUpload } from "@/components/admin/form/SingleImageUpload";
import { ProductPicker } from "@/components/admin/form/ProductPicker";
import { eventSchema, type EventFormInput, type EventFormValues } from "@/lib/admin/schemas";
import { createEventAction, updateEventAction } from "@/lib/admin/actions/eventActions";
import { uploadImageAction } from "@/lib/admin/actions/mediaActions";
import type { AdminEvent, AdminProduct } from "@/lib/admin/types";

interface EventFormProps {
  event?: AdminEvent;
  allProducts: AdminProduct[];
}

const defaultValues: EventFormInput = {
  name: "",
  shortName: "",
  year: new Date().getFullYear(),
  country: "",
  city: "",
  eventDate: "",
  tagline: "",
  description: "",
  bannerUrl: "",
  coverUrl: "",
  productIds: [],
};

export function EventForm({ event, allProducts }: EventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormInput, unknown, EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          name: event.name,
          shortName: event.shortName,
          year: event.year,
          country: event.country,
          city: event.city,
          eventDate: event.eventDate,
          tagline: event.tagline,
          description: event.description,
          bannerUrl: event.bannerUrl,
          coverUrl: event.coverUrl,
          productIds: event.productIds,
        }
      : defaultValues,
  });

  const onSubmit = (values: EventFormValues) => {
    setServerError(null);
    startTransition(async () => {
      try {
        if (event) {
          await updateEventAction(event.id, values);
          toast.success("Event updated");
        } else {
          await createEventAction(values);
          toast.success("Event created");
          router.push("/admin/events");
          return;
        }
        router.refresh();
      } catch {
        setServerError("Something went wrong — please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" render={<Link href="/admin/events" />} nativeButton={false}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="font-admin text-xl font-semibold tracking-tight">
              {event ? event.name : "New Event"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {event
                ? `Last updated ${new Date(event.updatedAt).toLocaleDateString("en-US")}`
                : "Add a new collector expo or showcase"}
            </p>
          </div>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {event ? "Save changes" : "Create event"}
        </Button>
      </div>

      {serverError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Event name" htmlFor="name" required error={errors.name?.message}>
                  <Input id="name" placeholder="e.g. Malaysia Diecast Expo" {...register("name")} />
                </FormField>
                <FormField label="Short name" htmlFor="shortName" required error={errors.shortName?.message} hint="Shown on the card, e.g. MDX">
                  <Input id="shortName" {...register("shortName")} />
                </FormField>
              </div>

              <FormField label="Tagline" htmlFor="tagline" required error={errors.tagline?.message}>
                <Input id="tagline" placeholder="e.g. Asia's Premier Diecast Event" {...register("tagline")} />
              </FormField>

              <FormField label="Description" htmlFor="description" required error={errors.description?.message}>
                <Textarea id="description" rows={4} {...register("description")} />
              </FormField>

              <div className="grid grid-cols-3 gap-4">
                <FormField label="Year" htmlFor="year" required error={errors.year?.message}>
                  <Input id="year" type="number" {...register("year")} />
                </FormField>
                <FormField label="Country" htmlFor="country" required error={errors.country?.message}>
                  <Input id="country" {...register("country")} />
                </FormField>
                <FormField label="City" htmlFor="city">
                  <Input id="city" {...register("city")} />
                </FormField>
              </div>

              <FormField label="Event date" htmlFor="eventDate" hint="Free text, e.g. &lsquo;30–31 August 2025&rsquo;">
                <Input id="eventDate" {...register("eventDate")} />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>Banner and cover artwork.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <Controller
                control={control}
                name="bannerUrl"
                render={({ field }) => (
                  <SingleImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    onUpload={(file) => uploadImageAction(file, "events/banner")}
                    label="Upload banner"
                    aspect="wide"
                  />
                )}
              />
              <Controller
                control={control}
                name="coverUrl"
                render={({ field }) => (
                  <SingleImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    onUpload={(file) => uploadImageAction(file, "events/cover")}
                    label="Upload cover"
                    aspect="video"
                  />
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Associate and reorder featured pieces.</CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                control={control}
                name="productIds"
                render={({ field }) => (
                  <ProductPicker allProducts={allProducts} selectedIds={field.value} onChange={field.onChange} />
                )}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
