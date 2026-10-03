# Paletto 🪵

**La place de marché des palettes entre particuliers.** Achetez, vendez ou donnez vos palettes près de chez vous — gratuit, sans commission.

## Fonctionnalités

- **Annonces** : dépôt en 2 minutes (type de palette, état, quantité, prix ou don, photos, ville), modification, statuts *En ligne / Réservée / Vendue*, suppression (photos comprises).
- **Photos** : jusqu'à 6 par annonce, redimensionnées et compressées dans le navigateur (WebP), stockées dans Supabase Storage.
- **Recherche** : plein texte en français, filtres type / état / département / prix max / gratuit / livraison, tri, pagination.
- **Ville automatique** : saisie du code postal → commune proposée via l'API officielle `geo.api.gouv.fr`.
- **Messagerie** acheteur ↔ vendeur, en temps réel (Supabase Realtime) avec rafraîchissement de secours, badge de messages non lus, accusés de lecture.
- **Comptes** : inscription / connexion e-mail + mot de passe, mot de passe oublié, profil public, favoris, suppression de compte.
- **Confiance** : signalement d'annonces, conseils de sécurité, e-mail jamais affiché.
- **SEO** : métadonnées, Open Graph, données structurées (Product, FAQ, WebSite), `sitemap.xml`, `robots.txt`, manifeste.
- **Pages légales** : mentions légales, CGU (L111-7 Code conso, art. 242 bis CGI, DSA), politique de confidentialité (RGPD).

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Server Components, Server Actions, `proxy.ts`) + React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Supabase](https://supabase.com) : Postgres + RLS, Auth, Storage, Realtime
- Hébergement : [Vercel](https://vercel.com)

## Démarrer en local

```bash
npm install
cp .env.example .env.local   # facultatif : les valeurs publiques du projet sont intégrées par défaut
npm run dev                  # http://localhost:3000
```

Scripts utiles : `npm run build`, `npm run lint`, `npm run typecheck`.

## Variables d'environnement

Aucune n'est obligatoire : l'URL et la clé **publique** (publishable) du projet Supabase sont intégrées dans
`src/lib/supabase/env.ts` (elles sont conçues pour être visibles ; la sécurité repose sur les règles RLS).

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Remplacent les valeurs intégrées (autre projet Supabase). |
| `NEXT_PUBLIC_SITE_URL` | URL publique (liens des e-mails, SEO). Par défaut : domaine de production Vercel. |
| `SUPABASE_SECRET_KEY` | *Optionnelle, secrète.* Active la suppression de compte en libre-service. |

## Base de données

Le schéma complet (tables, index, RLS, fonctions, stockage, temps réel) est dans
[`supabase/migrations/`](supabase/migrations). Projet Supabase : `nqpzxfbmcymyqvovpjqe` (région UE).

| Table | Contenu |
| --- | --- |
| `profiles` | Pseudo, ville, présentation (créé automatiquement à l'inscription) |
| `listings` | Annonces (recherche plein texte `search`, département calculé) |
| `favorites` | Favoris |
| `conversations`, `messages` | Messagerie (fonctions `start_conversation`, `mark_conversation_read`, `my_conversations`) |
| `reports` | Signalements (lisibles uniquement depuis le tableau de bord Supabase) |

## Réglages Supabase à faire une fois

Dans le tableau de bord Supabase du projet **Paletto** :

1. **Authentication → URL Configuration** : *Site URL* = l'URL de production Vercel, et ajouter `https://<votre-domaine>/**` dans *Redirect URLs*.
2. **Authentication → Sign In / Providers → Email** : désactiver *Confirm email* **ou** configurer un SMTP
   (Authentication → Emails → SMTP Settings, ex. Resend ou Brevo). Le service d'e-mail par défaut de Supabase
   n'envoie qu'aux membres de votre organisation : sans l'un de ces deux réglages, le public ne peut pas s'inscrire.
3. *(Recommandé avec un SMTP)* **Authentication → Emails → Templates** : dans « Confirm signup » et « Reset password »,
   remplacer le lien par `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email` (resp. `type=recovery`)
   pour que les liens fonctionnent même ouverts sur un autre appareil.

## Modération

Les signalements arrivent dans la table `reports` (Supabase → Table Editor). Pour retirer une annonce, supprimez sa
ligne dans `listings`.

## Avant l'ouverture au public

Complétez les informations de l'éditeur dans `src/lib/site.ts` (`legal`) : elles alimentent les mentions légales,
les CGU et la politique de confidentialité.
