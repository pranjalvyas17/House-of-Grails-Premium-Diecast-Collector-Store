import type { Metadata } from "next";
import { EventService } from "@/lib/admin/services";
import { EventsTable } from "@/components/admin/events/EventsTable";

export const metadata: Metadata = { title: "Events" };

export default async function AdminEventsPage() {
  const events = await EventService.getAll();
  return <EventsTable initialEvents={events} />;
}
