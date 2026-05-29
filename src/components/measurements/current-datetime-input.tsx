"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";

type CurrentDateTimeInputProps = {
  defaultValue: string;
};

function toDateTimeInputValue(date: Date) {
  const localDate = new Date(date);
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
  return localDate.toISOString().slice(0, 16);
}

export function CurrentDateTimeInput({ defaultValue }: CurrentDateTimeInputProps) {
  const [value, setValue] = useState(() => toDateTimeInputValue(new Date()) || defaultValue);

  return (
    <Input
      id="recorded_at"
      name="recorded_at"
      type="datetime-local"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      className="h-12 border-[#cfe5ed] bg-white text-base"
      suppressHydrationWarning
    />
  );
}
