"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormField } from "@/components/admin/form/FormField";
import { settingsSchema, type SettingsFormValues } from "@/lib/admin/schemas";
import { updateSettingsAction } from "@/lib/admin/actions/settingsActions";
import type { SiteSettings } from "@/lib/admin/types";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({ resolver: zodResolver(settingsSchema), defaultValues: settings });

  const onSubmit = (values: SettingsFormValues) => {
    startTransition(async () => {
      await updateSettingsAction(values);
      toast.success("Settings saved");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-admin text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Store-wide configuration.</p>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Save changes
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Site name" htmlFor="siteName" required error={errors.siteName?.message}>
              <Input id="siteName" {...register("siteName")} />
            </FormField>
            <FormField label="Tagline" htmlFor="tagline" required error={errors.tagline?.message}>
              <Input id="tagline" {...register("tagline")} />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Support email" htmlFor="supportEmail" required error={errors.supportEmail?.message}>
                <Input id="supportEmail" type="email" {...register("supportEmail")} />
              </FormField>
              <FormField label="Currency" htmlFor="currency" required error={errors.currency?.message}>
                <Input id="currency" {...register("currency")} />
              </FormField>
            </div>
            <FormField label="Shipping note" htmlFor="shippingNote">
              <Textarea id="shippingNote" rows={2} {...register("shippingNote")} />
            </FormField>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Instagram" htmlFor="instagramUrl">
                <Input id="instagramUrl" {...register("instagramUrl")} />
              </FormField>
              <FormField label="X (Twitter)" htmlFor="twitterUrl">
                <Input id="twitterUrl" {...register("twitterUrl")} />
              </FormField>
              <FormField label="YouTube" htmlFor="youtubeUrl">
                <Input id="youtubeUrl" {...register("youtubeUrl")} />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO defaults</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Default title" htmlFor="seoDefaultTitle" required error={errors.seoDefaultTitle?.message}>
                <Input id="seoDefaultTitle" {...register("seoDefaultTitle")} />
              </FormField>
              <FormField label="Default description" htmlFor="seoDefaultDescription" required error={errors.seoDefaultDescription?.message}>
                <Textarea id="seoDefaultDescription" rows={3} {...register("seoDefaultDescription")} />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance</CardTitle>
              <CardDescription>Temporarily take the storefront offline.</CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                control={control}
                name="maintenanceMode"
                render={({ field }) => (
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">Maintenance mode</p>
                      <p className="text-xs text-muted-foreground">Visitors see a holding page</p>
                    </div>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
