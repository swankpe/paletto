const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPrice(cents: number) {
  if (cents === 0) return "Gratuit";
  return euro.format(cents / 100);
}

export function formatUnitPrice(cents: number) {
  if (cents === 0) return "Gratuit";
  return `${euro.format(cents / 100)} / palette`;
}

export function formatTotalPrice(cents: number, quantity: number) {
  return euro.format((cents * quantity) / 100);
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
});

const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

const shortDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  timeZone: "Europe/Paris",
});

export function formatDate(value: string | Date) {
  return dateFormatter.format(new Date(value));
}

export function formatMemberSince(value: string | Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(value));
}

export function formatRelative(value: string | Date, now: Date = new Date()) {
  const date = new Date(value);
  const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
  if (diffSeconds < 60) return "à l'instant";
  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) return `il y a ${diffMinutes} min`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `il y a ${diffHours} h`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return "hier";
  if (diffDays < 7) return `il y a ${diffDays} jours`;
  return `le ${shortDateFormatter.format(date)}`;
}

export function formatMessageTime(value: string | Date, now: Date = new Date()) {
  const date = new Date(value);
  const sameDay =
    date.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" }) ===
    now.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" });
  return sameDay ? timeFormatter.format(date) : `${shortDateFormatter.format(date)}, ${timeFormatter.format(date)}`;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count.toLocaleString("fr-FR")} ${count > 1 ? plural : singular}`;
}
