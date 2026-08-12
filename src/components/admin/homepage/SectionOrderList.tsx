"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { HomepageSection } from "@/lib/admin/types";

interface SectionOrderListProps {
  sections: HomepageSection[];
  onChange: (sections: HomepageSection[]) => void;
}

function Row({ section, onToggle }: { section: HomepageSection; onToggle: (enabled: boolean) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 ${isDragging ? "z-10 opacity-70" : ""}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical size={15} />
      </button>
      <span className={`flex-1 text-sm font-medium ${!section.enabled ? "text-muted-foreground" : ""}`}>
        {section.label}
      </span>
      <Switch checked={section.enabled} onCheckedChange={onToggle} />
    </div>
  );
}

/** Reorder homepage sections and toggle each on/off. */
export function SectionOrderList({ sections, onChange }: SectionOrderListProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    onChange(arrayMove(sections, oldIndex, newIndex));
  };

  return (
    <DndContext id="section-order" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {sections.map((section) => (
            <Row
              key={section.id}
              section={section}
              onToggle={(enabled) =>
                onChange(sections.map((s) => (s.id === section.id ? { ...s, enabled } : s)))
              }
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
