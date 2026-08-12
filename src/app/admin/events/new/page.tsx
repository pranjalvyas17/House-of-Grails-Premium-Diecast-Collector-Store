import type { Metadata } from "next";
import { EventForm } from "@/components/admin/events/EventForm";
import { ProductService } from "@/lib/admin/services";

export const metadata: Metadata = { title: "New Event" };

export default async function NewEventPage() {
  const products = await ProductService.getAll();
  return <EventForm allProducts={products} />;
}
