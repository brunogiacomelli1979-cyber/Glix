import { getGlucoseStatus } from "@/lib/glucose";

type StatusBadgeProps = {
  value?: number | null;
};

export function StatusBadge({ value }: StatusBadgeProps) {
  const status = getGlucoseStatus(value);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.8rem] font-medium ${status.chip}`}
    >
      <span className={`size-1.5 rounded-full ${status.dot}`} />
      {status.label}
    </span>
  );
}
