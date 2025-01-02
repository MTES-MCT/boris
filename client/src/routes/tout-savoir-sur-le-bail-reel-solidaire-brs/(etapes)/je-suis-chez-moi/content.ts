import type { StepSection } from '$lib/utils/definitions';

export const sections: StepSection[] = [
  {
    id: 'l-assurance-de-mon-logement',
    title: 'L’assurance de mon logement en BRS',
    content: `
      <p>
        Les propriétaires occupants leur logement en copropriété sont dans
        l’obligation de l’assurer, au moins pour la responsabilité civile. Une
        assurance habitation multirisques peut par ailleurs être souscrite.
      </p>
      <p class="fr-mb-0">
        Si vous entrez dans un logement en Bail Réel Solidaire neuf ou qu’il a été
        remis à neuf après des travaux, vous bénéficiez de différentes garanties, à
        la charge des entreprises en charge des travaux :
      </p>
      <ul class="fr-mb-0">
        <li>
          La garantie de parfait achèvement qui impose pendant un an aux
          constructeurs de réparer tous les désordres constatés lors de la réception
          des travaux
        </li>
        <li>
          La garantie de bon fonctionnement qui impose pendant deux ans aux
          constructeurs de réparer ou remplacer les équipements défaillants
        </li>
        <li>
          La garantie décennale qui impose pendant dix ans aux constructeurs de
          réparer l’ensemble des dommages non décelables à la réception des travaux,
          rendant le logement impropre à sa destination, ou compromettant sa
          solidité.
        </li>
      </ul>
    `,
  },
  {
    id: 'realiser-des-travaux',
    title: 'Réaliser des travaux',
    content: `
      <p>
        Tout d’abord, le ménage propriétaire d’un logement en Bail Réel Solidaire
        doit le maintenir en bon état. Il est tenu responsable de toutes les
        réparations potentiellement nécessaires en ce qui le concerne.
      </p>
      <p class="fr-mb-0">
        Les conditions de réalisation de travaux sont en général précisées dans le
        Bail Réel Solidaire et contractualisées entre l’Organisme de Foncier
        Solidaire et les ménages acheteurs.
      </p>
    `,
  },
  {
    id: 'la-vie-en-copropriete',
    title: 'La vie en copropriété',
    content: `
      <p>
        Le fonctionnement d’une copropriété avec des logements en Bail Réel
        Solidaire est identique à l’organisation classique d’une copropriété. Vous
        devez ainsi vous acquitter de charges de copropriété.
      </p>
      <p>
        L’Organisme de Foncier Solidaire disposant de la propriété foncière, il est
        membre de la copropriété. En tant que propriétaire, vous pouvez également
        siéger en Assemblée générale des copropriétaires.
      </p>
      <p class="fr-mb-0">
        Le ménage dispose du droit de vote pour toutes les décisions exceptées :
      </p>
      <ul class="fr-mb-0">
        <li>les décisions portant sur les actes d’acquisitions immobilières</li>
        <li>
          les décisions portant sur les actes de disposition (établissement de cours
          communes, servitudes, cession de droits de mitoyenneté, acquisition d’une
          partie privative par le syndicat ou, à l’inverse, l’octroi d’occupation
          d’une partie privative)
        </li>
        <li>
          les décisions portant sur la réalisation de travaux comportant
          transformation, addition, amélioration, modification des bâtiments.
        </li>
      </ul>
    `,
  },
  {
    id: 'revendre-mon-logement',
    title: 'Revendre mon logement',
    content: `
      <p>
        Une fois propriétaire de votre logement en BRS, vous pouvez revendre ce
        dernier à n’importe quel moment. Dans ce cas, vous devez notifier
        l’Organisme de Foncier Solidaire de votre souhait et celui-ci peut décider
        de racheter lui-même votre logement.
      </p>
      <p>
        Si l’Organisme de Foncier Solidaire ne souhaite pas racheter votre logement,
        vous pouvez le revendre à un autre ménage. Cependant, puisque le Bail Réel
        Solidaire est un dispositif d’accession abordable à la propriété, vous devez
        le vendre à un ménage sous conditions de ressources. Ce ménage doit par
        ailleurs être agréé par l’Organisme de Foncier Solidaire pour ensuite vivre
        dans le logement en BRS à titre de résidence principale.
      </p>
      <p>
        Dans ces deux cas, le prix de vente de votre logement est fixé par
        l’Organisme de Foncier Solidaire. Ce prix est calculé à partir du prix lors
        de votre achat, et la plus-value est encadrée, afin de permettre à d’autres
        ménages d’accéder facilement à la propriété. Ce prix est modulé en fonction
        des conditions du marché immobilier et les travaux effectués sont pris en
        compte dans le calcul. Une méthode d’évaluation du logement peut être
        contractualisée entre et l’Organisme de Foncier Solidaire et le ménage
        preneur et être inscrite dans le Bail Réel Solidaire.
      </p>
      <p>
        La plus-value que vous faites en cas de revente est donc encadrée et
        contenue. Cela dit, la revente d’un logement en BRS au bout de quelques
        années vous assure la formation d’un premier capital financier qui peut vous
        permettre d’accéder à la propriété dans le marché libre.
      </p>
      <p>
        Vous pouvez vous-même trouver le ménage remplissant ces conditions ou
        demander à être accompagné par votre Organisme de Foncier Solidaire dans la
        recherche d’un ménage preneur
      </p>
      <p class="fr-mb-0">
        Enfin, si vous ne trouvez pas de preneur, l’Organisme de Foncier Solidaire
        peut racheter votre logement suivant une clause de rachat qui existe dans
        votre acte notarié. Une de ces modalités peut être le rachat du logement à
        un certain pourcentage du prix de vente initial. N’oubliez pas de demander
        quelles sont les conditions de rachat dans votre cas.
      </p>
    `,
  },
];
