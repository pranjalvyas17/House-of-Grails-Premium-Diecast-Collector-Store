import Link from "next/link";
import { Package, CalendarDays, Tag, TrendingUp, ArrowRight, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/admin/StatCard";
import { MiniAreaChart } from "@/components/admin/MiniAreaChart";
import { ProductService, EventService, BrandService } from "@/lib/admin/services";

const revenueTrend = [12, 19, 14, 22, 28, 24, 31, 27, 35, 40, 38, 46];
const ordersTrend = [4, 6, 5, 8, 7, 9, 12, 10, 13, 15, 14, 18];

export default async function AdminDashboardPage() {
  const [products, events, brands] = await Promise.all([
    ProductService.getAll(),
    EventService.getAll(),
    BrandService.getAll(),
  ]);

  const active = products.filter((p) => p.status === "active");
  const lowStock = products.filter((p) => p.stock <= 5 && p.status === "active");
  const inventoryValue = active.reduce((sum, p) => sum + p.price * p.stock, 0);
  const recent = [...products]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-admin text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back — here&apos;s what&apos;s happening across the store.
          </p>
        </div>
        <Button render={<Link href="/admin/products/new" />} nativeButton={false}>
          <Plus /> New Product
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Products" value={String(active.length)} delta={4.2} icon={Package} />
        <StatCard label="Inventory Value" value={`$${inventoryValue.toLocaleString()}`} delta={8.1} icon={TrendingUp} />
        <StatCard label="Live Events" value={String(events.length)} delta={2.5} icon={CalendarDays} />
        <StatCard label="Brands" value={String(brands.length)} icon={Tag} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Revenue (mock)</CardTitle>
            <CardDescription>Last 12 weeks — wire up to real analytics later.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="font-admin text-3xl font-semibold">$48,320</p>
                <p className="text-xs text-emerald-500">+12.4% vs previous period</p>
              </div>
            </div>
            <MiniAreaChart data={revenueTrend} className="mt-4 h-24 w-full text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders (mock)</CardTitle>
            <CardDescription>Last 12 weeks.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-admin text-3xl font-semibold">312</p>
            <p className="text-xs text-emerald-500">+6.8% vs previous period</p>
            <MiniAreaChart data={ordersTrend} className="mt-4 h-24 w-full text-emerald-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Recently added</CardTitle>
              <CardDescription>The last few products touched in the catalog.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" render={<Link href="/admin/products" />} nativeButton={false}>
              View all <ArrowRight size={14} />
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {recent.map((p) => (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}`}
                className="flex items-center justify-between rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 overflow-hidden rounded-md bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images[0]?.url} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.brand}</p>
                  </div>
                </div>
                <Badge variant={p.status === "active" ? "default" : "secondary"} className="capitalize">
                  {p.status}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Needs attention</CardTitle>
            <CardDescription>Low stock, 5 units or fewer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {lowStock.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">Nothing urgent right now.</p>
            )}
            {lowStock.slice(0, 6).map((p) => (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}`}
                className="flex items-center justify-between rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-muted"
              >
                <p className="font-medium">{p.name}</p>
                <Badge variant="destructive">{p.stock} left</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
