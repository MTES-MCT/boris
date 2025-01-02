import type { StepSection } from '$lib/utils/definitions';

export const sections: StepSection[] = [
  {
    id: 'definir-son-projet-d-achat',
    title: 'Définir son projet d’achat',
    content: `
    <p class="fr-mb-0">
      Avant toute chose, il faut établir un projet d’achat clair, qui répond à vos
      besoins.
    </p>
    <ul>
      <li>Quel est le quartier dans lequel vous souhaitez habiter ?</li>
      <li>
        Quels sont vos critères d’accès aux moyens de transport, aux espaces
        naturels, aux écoles et crèches, aux commerces… ?
      </li>
      <li>
        De combien de pièces avez-vous besoin ? Souhaitez-vous un espace extérieur
        ?
      </li>
      <li>Quelle est la surface minimum que vous souhaitez avoir ?</li>
      <li>
        Savez-vous combien de temps vous prévoyez de vivre dans ce logement ?
      </li>
      <li>Quel est votre budget ?</li>
    </ul>
    <p class="fr-mb-0">
      L’ensemble des réponses à ces questions permettent de trouver les bons
      interlocuteurs et d’estimer le coût du logement. C’est notamment de ces
      sujets que vous discuterez avec le ou la professionnel.le de l'immobilier
      qui vous accompagnera.
    </p>
  `,
  },
  {
    id: 'trouver-des-logements-en-BRS',
    title: 'Trouver des logements en BRS',
    content: `
      <p>
        La première étape est de trouver un logement en vente. Pour cela, vous
        pouvez rechercher directement sur les sites des professionel.les vendant des
        logements en BRS. Vous pouvez aussi faire des recherches sur les sites
        d’annonces classiques (Seloger, Bienici, Leboncoin). Par ailleurs, nous
        sommes en lien direct avec des professionnel.lles spécialisé.es dans le Bail
        Réel Solidaire.
      </p>
      <button class="fr-btn fr-btn--lg">
        <a href="/organismes-fonciers-solidaires">
          Prendre contact pour trouver un logement en BRS
        </a>
      </button>  
    `,
  },
  {
    id: 'completer-mon-dossier',
    title: 'Compléter mon dossier',
    content: `
      <p class="fr-mb-0">
        Pour votre premier échange avec le ou la professionnel.le de l'immobilier
        chargé·e de la vente du logement qui vous intéresse, vous aurez besoin de
        prouver votre éligibilité. Vous devez ainsi préparer les pièces suivantes :
      </p>
      <ul>
        <li>votre avis d’imposition pour 2022 (année n-2) seul.e/à deux</li>
        <li>la copie d’une pièce d’identité</li>
        <li>le cas échéant, la copie de votre livret de famille</li>
        <li>un justificatif de domicile</li>
      </ul>
      <p class="fr-mb-0">
        Par ailleurs, d’autres pièces sont nécessaires pour vous assurer un
        accompagnement de qualité :
      </p>
      <ul>
        <li>Une simulation bancaire</li>
        <li>Le cas échéant, le justificatif de votre apport personnel</li>
      </ul>
      <p class="fr-mb-0">
        Chaque professionnel pouvant avoir des pratiques différentes, d’autres
        documents pourront vous être demandés.
      </p>    
    `,
  },
];
