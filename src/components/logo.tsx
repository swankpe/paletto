import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9", className)} aria-hidden>
      <rect width="40" height="40" rx="11" className="fill-brand-500" />
      <g className="fill-white">
        <rect x="8" y="10" width="24" height="4" rx="1.2" />
        <rect x="8" y="16.5" width="24" height="4" rx="1.2" />
        <rect x="8" y="23" width="24" height="3" rx="1.2" opacity="0.9" />
        <rect x="8" y="26" width="5" height="5" rx="1" />
        <rect x="17.5" y="26" width="5" height="5" rx="1" />
        <rect x="27" y="26" width="5" height="5" rx="1" />
      </g>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-[1.45rem] font-bold tracking-tight text-stone-900">
        Palett<span className="text-brand-500">o</span>
      </span>
    </span>
  );
}
