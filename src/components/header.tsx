import Link from "next/link";
import { Heart, MessageCircle, Plus } from "lucide-react";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";
import { getUnreadCount } from "@/lib/data/messages";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { UserMenu } from "./user-menu";
import { buttonClasses } from "./ui";

export async function Header() {
  const user = await getCurrentUser();
  const [profile, unread] = await Promise.all([getCurrentProfile(), getUnreadCount(user?.id)]);
  const displayName = profile?.display_name ?? user?.email?.split("@")[0] ?? "Mon compte";

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-cream/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-4">
        <Link href="/" className="shrink-0 rounded-lg" aria-label="Paletto — accueil">
          <Logo />
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          <Link href="/annonces" className={buttonClasses({ variant: "ghost", size: "sm" })}>
            Annonces
          </Link>
          <Link href="/comment-ca-marche" className={buttonClasses({ variant: "ghost", size: "sm" })}>
            Comment ça marche
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          {user ? (
            <>
              <Link
                href="/messages"
                className="relative hidden size-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-900/5 sm:inline-flex"
                aria-label={unread > 0 ? `Messages (${unread} non lus)` : "Messages"}
              >
                <MessageCircle className="size-5" aria-hidden />
                {unread > 0 ? (
                  <span className="absolute right-1 top-1 inline-flex min-w-4.5 items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-bold leading-4.5 text-white">
                    {unread > 99 ? "99+" : unread}
                  </span>
                ) : null}
              </Link>
              <Link
                href="/compte/favoris"
                className="hidden size-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-900/5 sm:inline-flex"
                aria-label="Mes favoris"
              >
                <Heart className="size-5" aria-hidden />
              </Link>
              <div className="hidden md:block">
                <UserMenu displayName={displayName} />
              </div>
            </>
          ) : (
            <Link href="/connexion" className={buttonClasses({ variant: "ghost", size: "sm", className: "hidden md:inline-flex" })}>
              Se connecter
            </Link>
          )}

          <Link href="/deposer" className={buttonClasses({ size: "sm", className: "hidden sm:inline-flex" })}>
            <Plus className="size-4" aria-hidden />
            Déposer une annonce
          </Link>

          <MobileMenu isLoggedIn={Boolean(user)} displayName={displayName} unread={unread} />
        </div>
      </div>
    </header>
  );
}
