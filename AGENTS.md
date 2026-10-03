<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Paletto — notes pour les agents

- UI et contenus en français. Next.js 16 : `proxy.ts` (et non `middleware.ts`), `params`/`searchParams` asynchrones, types `PageProps<"/route">`.
- Supabase : client serveur `src/lib/supabase/server.ts`, client navigateur `src/lib/supabase/client.ts`. Toute la sécurité des données repose sur les politiques RLS (`supabase/migrations/`).
- Mutations via Server Actions dans `src/lib/actions/`, lectures dans `src/lib/data/`.
- Avant de pousser : `npm run typecheck && npm run lint && npm run build`.
- Tailwind 4 : ne combinez pas `hidden` avec une classe d'affichage de base (`inline-flex`, `grid`…) ; utilisez les variantes `max-sm:hidden`, `max-md:hidden`…
