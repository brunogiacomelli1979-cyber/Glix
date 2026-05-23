"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SubmitButtonProps = {
  children: ReactNode;
  className?: string;
  pendingText: string;
};

export function SubmitButton({ children, className, pendingText }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn("bg-[#0f6f8f] text-white hover:bg-[#0b5f7b]", className)}
    >
      {pending ? pendingText : children}
    </Button>
  );
}
