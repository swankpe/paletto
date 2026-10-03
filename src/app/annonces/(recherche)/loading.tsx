export default function Loading() {
  return (
    <div className="container-page py-10" aria-busy="true" aria-live="polite">
      <div className="h-10 w-72 animate-pulse rounded-xl bg-stone-200" />
      <div className="mt-3 h-5 w-48 animate-pulse rounded-lg bg-stone-200" />
      <div className="mt-6 h-32 animate-pulse rounded-2xl bg-white" />
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="aspect-[4/3] animate-pulse bg-stone-200" />
            <div className="space-y-2 p-4">
              <div className="h-5 w-24 animate-pulse rounded bg-stone-200" />
              <div className="h-4 w-full animate-pulse rounded bg-stone-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-stone-100" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Chargement des annonces…</span>
    </div>
  );
}
