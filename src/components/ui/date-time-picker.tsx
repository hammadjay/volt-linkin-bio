"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick a date & time",
}: {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);

  function handleDateSelect(day: Date | undefined) {
    if (!day) {
      onChange(null);
      return;
    }
    const merged = new Date(day);
    if (value) {
      merged.setHours(value.getHours(), value.getMinutes());
    }
    onChange(merged);
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const updated = value ? new Date(value) : new Date();
    updated.setHours(hours, minutes, 0, 0);
    onChange(updated);
  }

  const timeValue = value
    ? `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`
    : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "MMM d, yyyy HH:mm") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="border-t border-border px-3 py-2">
          <input
            type="time"
            value={timeValue}
            onChange={handleTimeChange}
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
