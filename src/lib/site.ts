export const siteConfig = {
  name: "Paletto",
  tagline: "Les palettes passent de main en main",
  description:
    "Paletto est la place de marché des palettes entre particuliers : achetez, vendez ou donnez vos palettes en bois près de chez vous, gratuitement et sans intermédiaire.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "fr_FR",
  // Informations légales de l'éditeur — à compléter avant l'ouverture au public.
  legal: {
    publisher: "[Nom ou raison sociale de l'éditeur]",
    status: "[Forme juridique — ex. micro-entreprise, SAS…]",
    address: "[Adresse postale complète]",
    siren: "[Numéro SIREN / RCS]",
    director: "[Nom du directeur de la publication]",
    contactEmail: "[adresse e-mail de contact]",
    host: "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com",
    dataHost: "Supabase Inc. — données hébergées dans l'Union européenne (Irlande) — supabase.com",
  },
} as const;

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
