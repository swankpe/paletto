import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/mentions-legales" },
};

export default function LegalNoticePage() {
  const { legal } = siteConfig;
  return (
    <LegalPage title="Mentions légales" updated="3 octobre 2026">
      <p>
        Conformément aux articles 6-III et 19 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie
        numérique (LCEN), voici les informations relatives à l&apos;éditeur et à l&apos;hébergeur du site {siteConfig.name}.
      </p>

      <h2>Éditeur du site</h2>
      <ul>
        <li>Éditeur : {legal.publisher}</li>
        <li>Statut : {legal.status}</li>
        <li>Adresse : {legal.address}</li>
        <li>Immatriculation : {legal.siren}</li>
        <li>Directeur de la publication : {legal.director}</li>
        <li>Contact : {legal.contactEmail}</li>
      </ul>

      <h2>Hébergement</h2>
      <ul>
        <li>Site web : {legal.host}</li>
        <li>Base de données et fichiers : {legal.dataHost}</li>
      </ul>

      <h2>Rôle de {siteConfig.name}</h2>
      <p>
        {siteConfig.name} est une plateforme de mise en relation entre particuliers. Au sens de la LCEN et du règlement
        européen sur les services numériques (DSA), {siteConfig.name} agit en qualité d&apos;hébergeur des annonces publiées
        par ses utilisateurs, qui en sont seuls responsables. {siteConfig.name} n&apos;est partie à aucune transaction.
      </p>

      <h2>Signaler un contenu illicite</h2>
      <p>
        Chaque annonce comporte un lien « Signaler cette annonce ». Vous pouvez également écrire à {legal.contactEmail} en
        précisant l&apos;adresse de l&apos;annonce, la nature du contenu et les raisons pour lesquelles il vous paraît illicite.
        Ce contact constitue le point de contact unique prévu par le règlement (UE) 2022/2065.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        La marque, le logo, la charte graphique et le code du site sont la propriété de l&apos;éditeur. Les photos et textes
        des annonces restent la propriété de leurs auteurs, qui concèdent à {siteConfig.name} le droit de les afficher sur
        le site pendant la durée de publication.
      </p>
    </LegalPage>
  );
}
