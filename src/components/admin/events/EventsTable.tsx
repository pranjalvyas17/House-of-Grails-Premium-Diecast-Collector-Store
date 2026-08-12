"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Search, Plus, MoreHorizontal, Pencil, Trash2, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { deleteEventAction } from "@/lib/admin/actions/eventActions";
import type { AdminEvent } from "@/lib/admin/types";

export function EventsTable({ initialEvents }: { initialEvents: AdminEvent[] }) {
  const [events, setEvents] = useState(initialEvents);
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminEvent | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(
    () => events.filter((e) => `${e.name} ${e.shortName} ${e.country}`.toLowerCase().includes(query.toLowerCase())),
    [events, query]
  );

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    startTransition(async () => {
      const ok = await deleteEventAction(target.id, target.slug);
      if (ok) {
        setEvents((prev) => prev.filter((e) => e.id !== target.id));
        toast.success(`${target.name} deleted`);
      }
      setDeleteTarget(null);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-admin text-2xl font-semibold tracking-tight">Events</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} of {events.length} events</p>
        </div>
        <Button render={<Link href="/admin/events/new" />} nativeButton={false}>
          <Plus size={16} /> Add Event
        </Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events…" className="pl-8" />
      </div>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Year</TableHead>
              <TableHead className="text-right">Products</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <CalendarX size={28} />
                    <p className="text-sm">No events match your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {filtered.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <Link href={`/admin/events/${event.id}`} className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium">{event.name}</p>
                      <p className="text-xs text-muted-foreground">{event.tagline}</p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {event.city ? `${event.city}, ${event.country}` : event.country}
                </TableCell>
                <TableCell className="text-sm">{event.year}</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">{event.productIds.length}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon-sm" nativeButton>
                          <MoreHorizontal size={15} />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem render={<Link href={`/admin/events/${event.id}`} />}>
                        <Pencil size={14} /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(event)}>
                        <Trash2 size={14} /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This can&apos;t be undone. Products associated with this event will keep their own listing but lose this event tag.
            </AlertDialogDescription>
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
