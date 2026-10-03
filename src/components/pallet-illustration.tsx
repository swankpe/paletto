import { cn } from "@/lib/cn";

/** Illustration de palette utilisée lorsqu'une annonce n'a pas de photo. */
export function PalletIllustration({ className, variant = "europe" }: { className?: string; variant?: string }) {
  const plank = variant === "plastique" ? "#5f8fa8" : "#d9a066";
  const plankDark = variant === "plastique" ? "#456f86" : "#b97c45";
  const block = variant === "plastique" ? "#3d5f73" : "#9c6234";
  return (
    <div className={cn("flex size-full items-center justify-center bg-gradient-to-br from-sand to-brand-100", className)}>
      <svg viewBox="0 0 200 120" className="w-3/5 max-w-[220px] drop-shadow-sm" aria-hidden>
        <g>
          <polygon points="20,60 100,30 180,60 100,90" fill={plank} />
          <polygon points="20,60 100,90 100,98 20,68" fill={plankDark} />
          <polygon points="100,90 180,60 180,68 100,98" fill={block} opacity="0.85" />
          <g stroke={plankDark} strokeWidth="1.5" opacity="0.55">
            <line x1="40" y1="52.5" x2="120" y2="82.5" />
            <line x1="60" y1="45" x2="140" y2="75" />
            <line x1="80" y1="37.5" x2="160" y2="67.5" />
          </g>
          <rect x="22" y="68" width="12" height="16" fill={block} />
          <rect x="94" y="96" width="12" height="16" fill={block} />
          <rect x="166" y="68" width="12" height="16" fill={block} />
          <rect x="58" y="82" width="12" height="16" fill={block} opacity="0.9" />
          <rect x="130" y="82" width="12" height="16" fill={block} opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}
