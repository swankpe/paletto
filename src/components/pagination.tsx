import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function Pagination({
  page,
  totalPages,
  hrefForPage,
}: {
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  const visible = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const itemClass =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors";

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
      {page > 1 ? (
        <Link href={hrefForPage(page - 1)} className={cn(itemClass, "text-stone-700 hover:bg-stone-900/5")} rel="prev">
          <ChevronLeft className="size-4" aria-hidden />
          <span className="sr-only sm:not-sr-only">Précédente</span>
        </Link>
      ) : null}
      {visible.map((p, index) => (
        <span key={p} className="flex items-center gap-1.5">
          {index > 0 && p - visible[index - 1] > 1 ? <span className="px-1 text-stone-400">…</span> : null}
          <Link
            href={hrefForPage(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(itemClass, p === page ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-900/5")}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < totalPages ? (
        <Link href={hrefForPage(page + 1)} className={cn(itemClass, "text-stone-700 hover:bg-stone-900/5")} rel="next">
          <span className="sr-only sm:not-sr-only">Suivante</span>
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : null}
    </nav>
  );
}
