import Link from "next/link";
import { Plus } from "lucide-react";

export function FloatingRegisterButton() {
  return (
    <Link
      href="/registrar"
      aria-label="Registrar nova medição"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-20 inline-flex size-14 items-center justify-center rounded-full bg-[#0f6f8f] text-white shadow-xl shadow-sky-950/20 transition hover:bg-[#0b5f7b] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#7cc8da]/40"
    >
      <Plus className="size-6" />
    </Link>
  );
}
