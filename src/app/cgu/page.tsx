import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  alternates: { canonical: "/cgu" },
};

export default function TermsPage() {
  const name = siteConfig.name;
  return (
    <LegalPage title="Conditions générales d'utilisation" updated="3 octobre 2026">
      <p>
        Les présentes conditions générales d&apos;utilisation (CGU) encadrent l&apos;utilisation du site {name}, place de marché
        permettant à des particuliers d&apos;acheter, de vendre ou de donner des palettes. En créant un compte ou en publiant
        une annonce, vous acceptez ces CGU sans réserve.
      </p>

      <h2>1. Le service</h2>
      <p>
        {name} permet de publier des annonces de palettes et de contacter les autres membres via une messagerie interne.
        Le service est gratuit. {name} n&apos;est ni vendeur, ni acheteur, ni intermédiaire de paiement : les transactions
        (prix, paiement, retrait, livraison) sont conclues directement entre les membres, sous leur seule responsabilité.
      </p>

      <h2>2. Compte utilisateur</h2>
      <ul>
        <li>L&apos;inscription est réservée aux personnes majeures capables de contracter.</li>
        <li>Vous vous engagez à fournir des informations exactes et à garder votre mot de passe confidentiel.</li>
        <li>Le service est destiné aux particuliers. Les professionnels doivent s&apos;identifier comme tels auprès de leurs interlocuteurs et respecter le droit de la consommation.</li>
        <li>Vous pouvez supprimer votre compte à tout moment depuis la page « Mon profil ».</li>
      </ul>

      <h2>3. Règles de publication</h2>
      <p>Les annonces doivent concerner des palettes ou du bois de palette réellement disponibles. Sont notamment interdits :</p>
      <ul>
        <li>les annonces trompeuses, frauduleuses ou portant sur des biens volés ;</li>
        <li>les contenus illicites, injurieux, discriminatoires ou portant atteinte aux droits de tiers ;</li>
        <li>les photos ne vous appartenant pas, les coordonnées de tiers et la publicité sans rapport avec les palettes ;</li>
        <li>les annonces en double et l&apos;utilisation de la messagerie à des fins de démarchage ou de spam.</li>
      </ul>
      <p>
        {name} peut retirer, sans préavis, toute annonce ou tout compte ne respectant pas ces règles, notamment à la suite
        d&apos;un signalement. Le membre concerné en est informé et peut contester la décision en écrivant à l&apos;adresse
        indiquée dans les <Link href="/mentions-legales">mentions légales</Link>.
      </p>

      <h2>4. Responsabilités</h2>
      <p>
        Chaque membre est seul responsable du contenu qu&apos;il publie et des transactions qu&apos;il conclut. {name} ne
        garantit ni la qualité, ni la conformité, ni l&apos;état des palettes, ni la solvabilité des membres. Nous vous
        recommandons de suivre nos <Link href="/comment-ca-marche#securite">conseils de sécurité</Link> : remise en main propre,
        vérification avant paiement, aucun paiement à distance à un inconnu.
      </p>

      <h2>5. Fonctionnement de la plateforme et classement</h2>
      <p>
        Conformément à l&apos;article L. 111-7 du Code de la consommation : les annonces sont publiées par des particuliers.
        Les transactions entre particuliers ne relèvent pas du droit de la consommation (pas de droit de rétractation ni de
        garantie légale de conformité). Par défaut, les annonces sont classées de la plus récente à la plus ancienne ;
        l&apos;utilisateur peut les trier par prix. Aucun classement n&apos;est payant et aucune rémunération n&apos;est perçue
        par {name} sur les transactions.
      </p>

      <h2>6. Obligations fiscales et sociales</h2>
      <p>
        Conformément à l&apos;article 242 bis du Code général des impôts, nous vous informons que les revenus tirés de
        ventes réalisées via {name} peuvent être soumis à l&apos;impôt et aux cotisations sociales, en particulier en cas
        d&apos;activité habituelle d&apos;achat-revente. La vente occasionnelle de biens personnels d&apos;occasion est en
        principe exonérée. Pour en savoir plus : <a href="https://www.impots.gouv.fr" rel="noopener noreferrer" target="_blank">impots.gouv.fr</a> et{" "}
        <a href="https://www.urssaf.fr" rel="noopener noreferrer" target="_blank">urssaf.fr</a>.
      </p>

      <h2>7. Données personnelles</h2>
      <p>
        Le traitement de vos données est décrit dans notre <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>8. Modification et droit applicable</h2>
      <p>
        {name} peut faire évoluer les présentes CGU ; la version en vigueur est celle publiée sur cette page. Les CGU sont
        soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.
      </p>
    </LegalPage>
  );
}
