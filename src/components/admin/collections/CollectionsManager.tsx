"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductPicker } from "@/components/admin/form/ProductPicker";
import { setCollectionProductsAction } from "@/lib/admin/actions/collectionActions";
import type { Collection, AdminProduct } from "@/lib/admin/types";

export function CollectionsManager({
  initialCollections,
  allProducts,
}: {
  initialCollections: Collection[];
  allProducts: AdminProduct[];
}) {
  const [collections, setCollections] = useState(initialCollections);
  const [isPending, startTransition] = useTransition();

  const setProductIds = (key: Collection["key"], ids: string[]) => {
    setCollections((prev) => prev.map((c) => (c.key === key ? { ...c, productIds: ids } : c)));
  };

  const save = (key: Collection["key"]) => {
    const collection = collections.find((c) => c.key === key);
    if (!collection) return;
    startTransition(async () => {
      await setCollectionProductsAction(key, collection.productIds);
      toast.success(`${collection.name} updated`);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-admin text-2xl font-semibold tracking-tight">Collections</h1>
        <p className="text-sm text-muted-foreground">
          Curate which products appear in each homepage collection, and in what order.
        </p>
      </div>

      <Tabs defaultValue={collections[0]?.key}>
        <TabsList>
          {collections.map((c) => (
            <TabsTrigger key={c.key} value={c.key}>{c.name}</TabsTrigger>
          ))}
        </TabsList>

        {collections.map((collection) => (
          <TabsContent key={collection.key} value={collection.key} className="mt-4">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>{collection.name}</CardTitle>
                  <CardDescription>{collection.description}</CardDescription>
                </div>
                <Button size="sm" onClick={() => save(collection.key)} disabled={isPending}>
                  {isPending ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                  Save order
                </Button>
              </CardHeader>
              <CardContent>
                <ProductPicker
                  allProducts={allProducts}
                  selectedIds={collection.productIds}
                  onChange={(ids) => setProductIds(collection.key, ids)}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
