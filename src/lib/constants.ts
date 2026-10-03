export const PALLET_TYPES = {
  europe: {
    label: "Palette Europe (EPAL)",
    short: "Europe / EPAL",
    dimensions: "120 × 80 cm",
    description: "La palette standard en Europe, marquée EPAL ou EUR, très recherchée.",
  },
  standard: {
    label: "Palette standard / US",
    short: "Standard / US",
    dimensions: "120 × 100 cm",
    description: "Palette industrielle plus large, idéale pour les charges lourdes.",
  },
  demi: {
    label: "Demi-palette",
    short: "Demi-palette",
    dimensions: "80 × 60 cm",
    description: "Format compact, parfait pour le mobilier et les petits projets.",
  },
  perdue: {
    label: "Palette perdue",
    short: "Palette perdue",
    dimensions: "Dimensions variables",
    description: "Palette légère à usage unique, idéale pour le bricolage et le bois de récup.",
  },
  plastique: {
    label: "Palette plastique",
    short: "Plastique",
    dimensions: "Dimensions variables",
    description: "Résistante à l'humidité, lavable et durable.",
  },
  autre: {
    label: "Autre / sur mesure",
    short: "Autre",
    dimensions: "Dimensions variables",
    description: "Caisses, palettes hors normes, bois de palette démonté…",
  },
} as const;

export type PalletType = keyof typeof PALLET_TYPES;
export const PALLET_TYPE_KEYS = Object.keys(PALLET_TYPES) as PalletType[];

export const CONDITIONS = {
  neuve: { label: "Neuve", tone: "green" },
  tres_bon_etat: { label: "Très bon état", tone: "green" },
  bon_etat: { label: "Bon état", tone: "amber" },
  usagee: { label: "Usagée", tone: "amber" },
  a_reparer: { label: "À réparer / bois de récup", tone: "stone" },
} as const;

export type Condition = keyof typeof CONDITIONS;
export const CONDITION_KEYS = Object.keys(CONDITIONS) as Condition[];

export const LISTING_STATUSES = {
  active: { label: "En ligne" },
  reserved: { label: "Réservée" },
  sold: { label: "Vendue" },
} as const;

export type ListingStatus = keyof typeof LISTING_STATUSES;
export const LISTING_STATUS_KEYS = Object.keys(LISTING_STATUSES) as ListingStatus[];

export const REPORT_REASONS = {
  arnaque: "Tentative d'arnaque ou annonce frauduleuse",
  contenu_inapproprie: "Contenu inapproprié",
  deja_vendu: "Annonce déjà vendue / plus disponible",
  doublon: "Annonce en double",
  autre: "Autre raison",
} as const;

export type ReportReason = keyof typeof REPORT_REASONS;
export const REPORT_REASON_KEYS = Object.keys(REPORT_REASONS) as ReportReason[];

export const SORT_OPTIONS = {
  recent: "Plus récentes",
  prix_asc: "Prix croissant",
  prix_desc: "Prix décroissant",
} as const;

export type SortOption = keyof typeof SORT_OPTIONS;

export const LISTING_IMAGES_BUCKET = "listing-images";
export const MAX_IMAGES = 6;
export const PAGE_SIZE = 24;
