import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  alternates: { canonical: "/confidentialite" },
};

export default function PrivacyPage() {
  const { name, legal } = siteConfig;
  return (
    <LegalPage title="Politique de confidentialité" updated="3 octobre 2026">
      <p>
        {name} attache une grande importance à la protection de vos données personnelles. Cette politique explique quelles
        données nous collectons, pourquoi, et quels sont vos droits au titre du règlement général sur la protection des
        données (RGPD) et de la loi Informatique et Libertés.
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        {legal.publisher}, {legal.address}. Contact : {legal.contactEmail}.
      </p>

      <h2>Données collectées</h2>
      <ul>
        <li><strong>Compte</strong> : adresse e-mail, mot de passe (stocké chiffré), pseudo, ville et présentation facultatives.</li>
        <li><strong>Annonces</strong> : titre, description, photos, prix, quantité, code postal et ville.</li>
        <li><strong>Messagerie</strong> : messages échangés avec les autres membres.</li>
        <li><strong>Favoris et signalements</strong> que vous effectuez.</li>
        <li><strong>Données techniques</strong> : journaux de connexion (adresse IP, date, navigateur) conservés pour la sécurité.</li>
      </ul>

      <h2>Finalités et bases légales</h2>
      <ul>
        <li>Fournir le service (compte, annonces, messagerie, favoris) — exécution du contrat (CGU).</li>
        <li>Sécuriser la plateforme, prévenir la fraude et traiter les signalements — intérêt légitime et obligations légales (LCEN, DSA).</li>
        <li>Vous envoyer les e-mails indispensables (confirmation d&apos;inscription, réinitialisation du mot de passe) — exécution du contrat.</li>
      </ul>
      <p>Nous ne vendons jamais vos données et n&apos;affichons aucune publicité ciblée.</p>

      <h2>Ce qui est public</h2>
      <p>
        Votre pseudo, votre ville (si renseignée), votre présentation et vos annonces (dont la ville et le code postal) sont
        visibles par tous. Votre adresse e-mail n&apos;est jamais affichée. Vos messages ne sont visibles que par vous et votre
        interlocuteur.
      </p>

      <h2>Durées de conservation</h2>
      <ul>
        <li>Les données du compte, annonces, photos et messages sont conservés tant que le compte est actif, puis supprimés lors de sa suppression.</li>
        <li>Les annonces que vous supprimez sont effacées immédiatement, photos comprises.</li>
        <li>Les données de connexion sont conservées un an conformément aux obligations légales.</li>
      </ul>

      <h2>Destinataires et sous-traitants</h2>
      <ul>
        <li><strong>Supabase</strong> (base de données, authentification, stockage des photos) — données hébergées dans l&apos;Union européenne.</li>
        <li><strong>Vercel</strong> (hébergement du site) — susceptible de traiter des données techniques aux États-Unis, dans le cadre du Data Privacy Framework UE–États-Unis et de clauses contractuelles types.</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        {name} n&apos;utilise que des cookies strictement nécessaires au fonctionnement du site (maintien de votre session de
        connexion). Ils ne nécessitent pas de consentement. Aucun cookie publicitaire ni de mesure d&apos;audience tiers
        n&apos;est déposé.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation, d&apos;opposition et de
        portabilité de vos données. Vous pouvez modifier votre profil et supprimer votre compte directement depuis votre
        espace, ou nous écrire à {legal.contactEmail}. Vous pouvez également introduire une réclamation auprès de la CNIL
        (<a href="https://www.cnil.fr" rel="noopener noreferrer" target="_blank">cnil.fr</a>).
      </p>
    </LegalPage>
  );
}
