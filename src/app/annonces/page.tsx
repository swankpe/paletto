import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { ListingFilters } from "@/components/listing-filters";
import { ListingGrid } from "@/components/listing-card";
import { Pagination } from "@/components/pagination";
import { EmptyState, buttonClasses } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { PAGE_SIZE, PALLET_TYPES } from "@/lib/constants";
import { getFavoriteIds, filtersToSearchParams, parseFilters, searchListings } from "@/lib/data/listings";
import { departmentName } from "@/lib/departments";
import { pluralize } from "@/lib/format";

export async function generateMetadata({ searchParams }: PageProps<"/annonces">): Promise<Metadata> {
  const filters = parseFilters(await searchParams);
  const parts: string[] = [];
  parts.push(filters.type ? PALLET_TYPES[filters.type].label : "Palettes");
  if (filters.free) parts.push("gratuites");
  const dept = departmentName(filters.dept);
  const title = `${parts.join(" ")} à vendre${dept ? ` – ${dept} (${filters.dept})` : ""}`;
  return {
    title,
    description: `Annonces de ${parts.join(" ").toLowerCase()} entre particuliers${dept ? ` dans le département ${dept}` : " partout en France"}. Achetez, vendez ou donnez vos palettes sur Paletto.`,
    alternates: { canonical: `/annonces${filters.type ? `?type=${filters.type}` : ""}` },
  };
}

export default async function ListingsPage({ searchParams }: PageProps<"/annonces">) {
  const filters = parseFilters(await searchParams);
  const user = await getCurrentUser();
  const [{ listings, count }, favoriteIds] = await Promise.all([searchListings(filters), getFavoriteIds(user?.id)]);
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const activeCount = [filters.type, filters.condition, filters.dept, filters.maxPrice, filters.free, filters.delivery].filter(
    Boolean,
  ).length;
  const dept = departmentName(filters.dept);

  return (
    <div className="container-page py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {filters.type ? PALLET_TYPES[filters.type].label : "Toutes les palettes"}
          {dept ? <span className="text-stone-500"> · {dept}</span> : null}
        </h1>
        <p className="mt-2 text-stone-600">
          {count > 0
            ? `${pluralize(count, "annonce disponible", "annonces disponibles")}${filters.q ? ` pour « ${filters.q} »` : ""}`
            : "Aucune annonce ne correspond pour l'instant."}
        </p>
      </div>

      <ListingFilters
        activeCount={activeCount}
        values={{
          q: filters.q,
          type: filters.type,
          condition: filters.condition,
          dept: filters.dept,
          maxPrice: filters.maxPrice,
          free: filters.free,
          delivery: filters.delivery,
          sort: filters.sort,
        }}
      />

      <div className="mt-8">
        {listings.length > 0 ? (
          <>
            <ListingGrid listings={listings} favoriteIds={favoriteIds} priorityCount={4} />
            <Pagination
              page={filters.page}
              totalPages={totalPages}
              hrefForPage={(page) => {
                const params = filtersToSearchParams({ ...filters, page });
                const query = params.toString();
                return query ? `/annonces?${query}` : "/annonces";
              }}
            />
          </>
        ) : (
          <EmptyState
            icon={<SearchX className="size-10" />}
            title="Aucune palette trouvée"
            description={
              activeCount > 0 || filters.q
                ? "Essayez d'élargir votre recherche : un autre département, un autre type de palette ou moins de filtres."
                : "Aucune annonce n'est en ligne pour le moment. Revenez bientôt, ou publiez la première !"
            }
            action={
              <div className="flex flex-wrap justify-center gap-3">
                {activeCount > 0 || filters.q ? (
                  <Link href="/annonces" className={buttonClasses({ variant: "outline" })}>
                    Voir toutes les annonces
                  </Link>
                ) : null}
                <Link href="/deposer" className={buttonClasses()}>
                  Déposer une annonce
                </Link>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
