import type { ComponentProps, ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "forest";
export type ButtonSize = "sm" | "md" | "lg";

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap",
    size === "sm" && "h-9 px-4 text-sm",
    size === "md" && "h-11 px-5 text-sm",
    size === "lg" && "h-13 px-7 text-base",
    variant === "primary" && "bg-brand-500 text-white shadow-sm hover:bg-brand-600 active:bg-brand-700",
    variant === "forest" && "bg-forest-700 text-white shadow-sm hover:bg-forest-800",
    variant === "secondary" && "bg-stone-900 text-white hover:bg-stone-800",
    variant === "outline" && "border border-stone-300 bg-white text-stone-800 hover:border-stone-400 hover:bg-stone-50",
    variant === "ghost" && "text-stone-700 hover:bg-stone-900/5",
    variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
    className,
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("mb-1.5 block text-sm font-semibold text-stone-800", className)} {...props} />;
}

const fieldBase =
  "block w-full rounded-xl border bg-white px-3.5 text-[15px] text-stone-900 placeholder:text-stone-400 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:bg-stone-100";

export function Input({ className, invalid, ...props }: ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(fieldBase, "h-11", invalid ? "border-red-400" : "border-stone-300", className)}
      {...props}
    />
  );
}

export function Textarea({ className, invalid, ...props }: ComponentProps<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(fieldBase, "min-h-28 py-3 leading-relaxed", invalid ? "border-red-400" : "border-stone-300", className)}
      {...props}
    />
  );
}

export function Select({ className, invalid, ...props }: ComponentProps<"select"> & { invalid?: boolean }) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={cn(
        fieldBase,
        "h-11 appearance-none bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2378716c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")] bg-[length:16px] bg-[right_0.85rem_center] bg-no-repeat pr-10",
        invalid ? "border-red-400" : "border-stone-300",
        className,
      )}
      {...props}
    />
  );
}

export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-red-600">
      {message}
    </p>
  );
}

export function FieldHint({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-sm text-stone-500">{children}</p>;
}

export function Checkbox({ label, hint, className, ...props }: ComponentProps<"input"> & { label: ReactNode; hint?: ReactNode }) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3", className)}>
      <input
        type="checkbox"
        className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-md border-stone-300 accent-brand-500"
        {...props}
      />
      <span className="text-[15px] leading-snug text-stone-700">
        {label}
        {hint ? <span className="mt-0.5 block text-sm text-stone-500">{hint}</span> : null}
      </span>
    </label>
  );
}

export function Alert({
  tone = "info",
  children,
  className,
}: {
  tone?: "info" | "success" | "error";
  children: ReactNode;
  className?: string;
}) {
  const Icon = tone === "success" ? CheckCircle2 : tone === "error" ? AlertCircle : Info;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed",
        tone === "info" && "border-sky-200 bg-sky-50 text-sky-900",
        tone === "success" && "border-forest-200 bg-forest-50 text-forest-900",
        tone === "error" && "border-red-200 bg-red-50 text-red-800",
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  );
}

export function Badge({
  children,
  tone = "stone",
  className,
}: {
  children: ReactNode;
  tone?: "stone" | "brand" | "green" | "amber" | "red" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tone === "stone" && "bg-stone-100 text-stone-700",
        tone === "brand" && "bg-brand-100 text-brand-800",
        tone === "green" && "bg-forest-100 text-forest-800",
        tone === "amber" && "bg-amber-100 text-amber-800",
        tone === "red" && "bg-red-100 text-red-700",
        tone === "dark" && "bg-stone-900/80 text-white backdrop-blur",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-2xl border border-stone-200/80 bg-white shadow-card", className)} {...props} />;
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-stone-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-stone-300 bg-white/60 px-6 py-14 text-center">
      {icon ? <div className="mb-4 text-brand-500">{icon}</div> : null}
      <h2 className="text-xl font-semibold">{title}</h2>
      {description ? <p className="mt-2 max-w-md text-stone-600">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
