"use server";

import { EventService, type EventInput } from "@/lib/admin/services";
import { revalidateEventPaths } from "./revalidate";

export async function createEventAction(input: EventInput) {
  const event = await EventService.create(input);
  revalidateEventPaths(event.slug);
  return event;
}

export async function updateEventAction(id: string, patch: Partial<EventInput>) {
  const event = await EventService.update(id, patch);
  revalidateEventPaths(event?.slug);
  return event;
}

export async function deleteEventAction(id: string, slug?: string) {
  const ok = await EventService.delete(id);
  revalidateEventPaths(slug);
  return ok;
}
