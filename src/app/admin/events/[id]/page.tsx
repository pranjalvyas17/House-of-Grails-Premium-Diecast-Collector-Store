import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/events/EventForm";
import { EventService, ProductService } from "@/lib/admin/services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = await EventService.getById(id);
  return { title: event?.name ?? "Event" };
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [event, products] = await Promise.all([EventService.getById(id), ProductService.getAll()]);
  if (!event) notFound();

  return <EventForm event={event} allProducts={products} />;
}
