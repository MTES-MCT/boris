import type { Step } from '$lib/utils/definitions';

const step1 = {
  title: 'Je découvre le dispositif',
  headTitle: 'Découvrir le Bail Réel Solidaire - BRS - BoRiS',
  slug: 'je-decouvre-le-dispositif',
  description:
    'Vous trouverez ici toutes les informations pour découvrir le Bail Réel Solidaire (BRS). BoRiS est la plateforme de référence du ministère du Logement.',
};

const step2 = {
  title: 'Je trouve mon logement en BRS',
  headTitle: 'Comment trouver un logement en Bail Réel Solidaire - BRS - BoRiS',
  slug: 'je-trouve-mon-logement-en-BRS',
  description:
    'Toutes les informations pour trouver un logement en Bail Réel Solidaire (BRS). BoRiS est la plateforme de référence du ministère du Logement.',
};

const step3 = {
  title: 'Je cherche des financements',
  headTitle:
    'Financer l’achat d’un logement en Bail Réel Solidaire - BRS - BoRiS',
  slug: 'je-cherche-des-financements',
  description:
    'Toutes les informations pour financer votre projet d’achat en Bail Réel Solidaire (BRS).  BoRiS est la plateforme de référence du ministère du Logement.',
};

const step4 = {
  title: 'Je passe chez le notaire',
  headTitle: 'Le passage chez le notaire - Bail Réel Solidaire - BRS - BoRiS',
  slug: 'je-deviens-proprietaire',
  description:
    'Les informations sur le passage chez le notaire pour un achat en Bail Réel Solidaire (BRS). BoRiS est la plateforme de référence du Ministère du Logement.',
};

const step5 = {
  title: 'Je suis chez moi',
  headTitle:
    'Etre propriétaire d’un logement en Bail Réel Solidaire - BRS - BoRiS',
  slug: 'je-suis-chez-moi',
  description:
    'Toutes les informations nécessaires pour les ménages déjà propriétaires en Bail Réel Solidaire. BoRiS est la plateforme de référence du Ministère du Logement.',
};

export const steps: Step[] = [
  {
    ...step1,
    sections: [
      {
        id: 'les-avantages-du-BRS',
        title: 'Les avantages du BRS',
        content: `
          <p>
            Le Bail Réel Solidaire permet aux ménages éligibles d’acheter un logement à
            un prix abordable, particulièrement en zone tendue.
          </p>
          <p>
            Il s’adresse donc aux individus et familles qui ont des difficultés à
            accéder à la propriété dans le marché classique, parce que leurs revenus
            et/ou leur capital ne leur permettent pas d’avancer ou d’emprunter la somme
            suffisante. En achetant uniquement les murs et non le terrain, les ménages
            propriétaires d’un logement en BRS font en moyenne 30 à 50% d’économie par
            rapport à un achat d’un logement sur le marché libre. Les prix étant plus
            bas, l’emprunt à la banque l’est aussi, ce qui augmente les chances de
            l’obtenir et réduit la pression financière du remboursement de l’emprunt.
          </p>
          <p class="fr-mb-0">
            Le Bail Réel Solidaire vous permet ainsi de construire un patrimoine
            immobilier pour sortir du marché locatif, disposer de votre logement comme
            vous le souhaitez, ou bien transmettre ce patrimoine à vos proches par
            exemple.
          </p>
        `,
      },
      {
        id: 'les-contreparties-du-BRS',
        title: 'Les contreparties du BRS',
        content: `
          <p class="fr-mb-0">
            ll y a 3 obligations principales si vous souhaitez acheter en BRS :
          </p>
          <ol class="fr-mb-0">
            <li>
              Vous devez faire de ce logement votre résidence principale et y vivre
              vous-même. Vous ne pouvez donc pas utiliser votre logement pour de la
              location longue durée et en faire un investissement locatif.
            </li>
            <li>
              Vous partagez la propriété de votre logement avec un organisme de foncier
              solidaire et vous vous engagez à lui verser une redevance foncière
              mensuelle. Cette redevance peut varier en fonction de l’emplacement du
              logement, mais reste contenue.
            </li>
            <li>
              En cas de revente, la plus-value que vous pourrez faire est encadrée et ne
              pourra pas dépasser les limites fixées par la loi.
            </li>
          </ol>
        `,
      },
      {
        id: 'qui-a-acces-au-dispositif',
        title: 'Qui a accès au dispositif ?',
        content: `
          <p>
            Le Bail Réel Solidaire s’adresse à des ménages dont les ressources ne
            dépassent pas un certain plafond : environ 87% des personnes résidant en
            France sont éligibles.
          </p>
          <p>
            Vous souhaitez savoir si vous y avez droit ? Utilisez notre simulateur :
          </p>
          <a class="fr-btn fr-btn--lg" href="/simulateur-eligibilite">Suis-je éligible ?</a>
        `,
      },
      {
        id: 'les-interlocuteurs-d-un-projet-en-BRS',
        title: 'Les interlocuteurs d’un projet en BRS',
        content: `
          <p>
            Un certain nombre d’acteurs sont là pour vous accompagner dans vos
            démarches. La plupart d’entre eux sont les mêmes que pour un achat classique
            : <br />
            Le premier contact est le ou la professionnel.le de l'immobilier chargé·e de
            la vente du logement. Comme pour une vente classique, son rôle est de vous accompagner
            dans la recherche d’un bien puis dans votre achat.
          </p>
          <p>
            Dans la majorité des cas, les ménages souhaitant devenir propriétaire
            doivent obtenir un prêt auprès d’une banque. Si vous êtes dans ce cas, votre
            banquier·ère s’assure de votre solvabilité et vous aide dans votre plan de
            financement.
          </p>
          <p>
            Puisqu’il s’agit d’un achat de logement, le Bail Réel Solidaire doit être
            signé chez le notaire par l’acheteur et le propriétaire actuel du logement.
            Le notaire s’assure de la protection juridique des deux parties, garantit
            vos droits et vous indique vos devoirs.
          </p>
          <p>
            Il y a un dernier acteur important qui est spécifique au BRS : le
            propriétaire du terrain sur lequel est construit le logement. C’est un
            organisme agréé par l’Etat, dénommé Organisme de Foncier Solidaire (OFS).
            C’est cet organisme qui est à l’origine de la construction ou de la
            réhabilitation des logements. C’est à l’OFS que vous verserez une redevance
            mensuelle.
          </p>
          <a class="fr-btn fr-btn--lg" href="/logements-brs-disponibles">
            Prendre contact pour trouver un logement en BRS
          </a>
        `,
      },
    ],
    nextStep: step2,
  },
  {
    ...step2,
    sections: [
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
          <a class="fr-btn fr-btn--lg" href="/logements-brs-disponibles">
            Prendre contact pour trouver un logement en BRS
          </a>
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
    ],
    previousStep: step1,
    nextStep: step3,
  },
  {
    ...step3,
    sections: [
      {
        id: 'financer-son-logement',
        title: 'Financer son logement',
        content: `
          <p>
            Vous avez trouvé le logement adapté à votre situation (localisation, taille,
            confort) ? Voyons maintenant comment établir votre plan de financement.
          </p>
          <p>
            Il s’agit d’abord de bien estimer son apport personnel, les différentes
            aides existantes et de calculer le prêt immobilier nécessaire à
            l’acquisition de votre logement.
          </p>
          <p>
            Il s’agit ensuite de calculer l’ensemble des frais et charges à payer
            mensuellement suite à l’achat du logement et de vérifier que la somme à
            débourser chaque mois et bien compatible avec votre situation.
          </p>
          <p class="fr-mb-0">
            Enfin, l’accession à la propriété nécessite une projection sur plusieurs
            années. Prévoyez-vous de rester dans votre logement 5 ans ? 10 ans ? 25 ans
            ? Toute votre vie ? Souhaitez-vous le revendre à terme pour vous constituer
            une épargne ? Le transmettre à vos proches ? Les réponses à ces questions
            permettront d’ajuster votre projet au mieux !
          </p>    
        `,
      },
      {
        id: 'les-emprunts-et-aides-disponibles',
        title: 'Les emprunts et aides disponibles',
        content: `
          <p>Votre capacité d’emprunt dépend de plusieurs éléments.</p>
          <p>
            Généralement, les banques fondent leur calcul à partir de vos revenus
            mensuels : vos remboursements (intérêts et assurance compris) ne doivent pas
            dépasser un tiers de vos revenus, afin de rester en capacité de rembourser
            l’emprunt tout en conservant votre niveau de vie.
          </p>
          <p>
            Par ailleurs, votre capacité d’emprunt dépend aussi des taux en vigueur.
            Sachez qu’il n’existe pas à ce stade de prêts bancaires spécifiques pour du
            Bail Réel Solidaire.
          </p>
          <p>
            Lorsque vous estimez vos futurs remboursements mensuels, n'oubliez pas de
            prendre en compte les autres charges pouvant s'ajouter à votre emprunt,
            notamment la redevance foncière, la taxe foncière ou bien les charges de
            copropriété.
          </p>
          <p>
            Vous pouvez être éligible au Prêt à Taux Zéro, si c'est votre première
            accession à la propriété et sous l'une de ces différentes hypothèses :
            logement construit dans le neuf, logement ancien avec travaux importants à
            mener, achat d'un logement sous la forme d'une vente HLM.
          </p>
          <p>
            Si vous êtes salarié.e du secteur privé, vous pouvez vous renseigner sur les
            aides d’ <a
              href="https://www.actionlogement.fr/le-pret-accession"
              class="fr-link">
              Action Logement
            </a>
            .
          </p>
          <a
            class="fr-btn fr-btn--lg"
            href="https://www.calcul-ptz.fr/lissage.php"
            target="_blank">
            Simulateur prêt normal + PTZ
          </a>
        `,
      },
      {
        id: 'les-frais-a-payer-en-tant-que-propriétaire-en-BRS',
        title: 'Les frais à payer en tant que propriétaire en BRS',
        content: `
          <p class="fr-mb-0">
            Lors de votre achat, plusieurs dépenses sont à prévoir en addition du prix
            du logement, il faut notamment penser :
          </p>
          <ul>
            <li>
              aux frais de notaires, qui représentent 2,3% du prix du logement pour un
              logement dans le neuf et 8,7% pour un logement dans l’ancien
            </li>
            <li>
              aux frais de cautionnement de prêt, qui représentent généralement 1% du
              prix du logement
            </li>
          </ul>
          <p>
            L’ensemble de ces coûts représentent plusieurs milliers d’euros, et doivent
            être financés par votre apport personnel car les banques refusent
            généralement de prêter de l’argent pour les amortir.
          </p>
          <p class="fr-mb-0">
            Enfin, en tant que propriétaire d’un logement en BRS, voici les différentes
            charges et dépenses pour lesquelles vous devez vous acquitter mensuellement
            ou annuellement suite à votre achat :
          </p>
          <ul class="fr-mb-0">
            <li>mensualités de remboursement de prêt bancaire</li>
            <li>
              le paiement d’une redevance mensuelle auprès de l’OFS avec qui vous
              partagez la propriété du logement
            </li>
            <li>les charges de copropriété</li>
            <li>la taxe foncière</li>
            <li>une assurance habitation</li>
          </ul>
        `,
      },
      {
        id: 'l-achat-d-un-logement-une-projection-a-plus-long-terme',
        title: 'L’achat d’un logement, une projection à plus long terme',
        content: `
          <p>
            Lors de l’établissement de votre plan de financement, il convient de vous
            projeter dans le temps. Combien de temps souhaitez-vous vivre dans votre
            logement ? Est-ce plus avantageux qu’une location ? A la revente, quelle est
            l’épargne que je pourrais me constituer ?
          </p>
          <p class="fr-mb-0">
            <a
              href="/blog/un-exemple-pour-vous-projeter-dans-votre-achat-en-brs"
              class="fr-link">
              Nous prenons un exemple de cas sur notre blog pour vous aider à
              visualiser.
            </a>
          </p>
        `,
      },
    ],
    previousStep: step2,
    nextStep: step4,
  },
  {
    ...step4,
    sections: [
      {
        id: 'les-etapes-apres-avoir-trouve-un-logement',
        title: 'Les étapes après avoir trouvé un logement',
        content: `
          <p>
            Ça y est, vous avez trouvé votre logement idéal : vous avez fait une offre
            et elle a été acceptée. Vous avez vérifié auprès de votre banque que ce prix
            était compatible avec votre capacité d’emprunt, en tenant compte des frais
            de notaire. Il est temps d’aller voir celui-ci.
          </p>
          <p>
            Tout commence par la signature du compromis de vente, d’une promesse de
            vente ou d'un contrat de réservation entre l'acheteur·se et le·la
            vendeur·se. La promesse de vente engage uniquement le·la vendeur·se, qui
            réserve le bien à l'acheteur·se ; en contrepartie, celui-ci ou celle-ci
            verse une avance pour immobiliser le bien (remboursée en cas d'annulation de
            la procédure), généralement de 10% (ce montant peut être fixe, ou d'un
            pourcentage différent). Le compromis engage les deux parties de manière
            égale. Cet avant-contrat prévoit des clauses suspensives, qui peuvent faire
            annuler la vente sans frais (par exemple, la non-obtention du prêt
            immobilier).
            <br />
            Suite à cela, vous allez faire les démarches pour obtenir votre prêt immobilier.
          </p>
          <p>
            Ensuite, avant la signature de l'acte de vente chez le notaire, les parties
            rassemblent les documents nécessaires. Le montant correspondant au prix du
            bien et aux frais de notaire doit être versé au notaire quelques jours avant
            la vente.
          </p>
          <p class="fr-mb-0">
            Enfin, les parties fixent un rendez-vous chez le notaire pour la signature
            de l'acte de vente. Lors de cette rencontre, le notaire explique en détail
            le contenu de l'acte, vérifie l'identité du vendeur et de l’acheteur (ou des
            acheteurs si vous achetez en couple), s'assure de la régularité de la
            transaction, et recueille les signatures. Enfin, le notaire procède à
            l'enregistrement de l'acte au service de la publicité foncière pour
            officialiser la vente.
          </p>  
        `,
      },
      {
        id: 'choisir-son-ou-sa-notaire',
        title: 'Choisir son ou sa notaire',
        content: `
          <p>
            Le dispositif de Bail Réel Solidaire étant relativement récent, certains
            notaires sont plus expérimentés et formés que d’autres à accompagner des
            ménages dans leur projet d’achat de logement en BRS.
          </p>
          <p>
            Les Organismes de Foncier Solidaire et les professionnel.les de la vente
            travaillent généralement avec des notaires spécialisés. À moins que vous
            teniez à travailler avec un notaire en particulier, nous vous conseillons de
            choisir le notaire qui vous sera proposé.
          </p>
        `,
      },
      {
        id: 'les-documents-a-fournir',
        title: 'Les documents à fournir',
        content: `
          <p class="fr-mb-0">
            Lors de votre passage chez le notaire, vous aurez besoin des documents
            suivants :
          </p>
          <ul class="fr-mb-0">
            <li>Un justificatif d’identité</li>
            <li>
              Un justificatif de situation familiale (copie du livret de famille,
              contrat de mariage, attestation de PACS, etc)
            </li>
            <li>Un justificatif de domicile</li>
            <li>
              Si vous avez souscrit à un prêt immobilier, un document indiquant le nom
              et l’adresse de la banque, ainsi que le montant et le taux du prêt.
            </li>
            <li>L’agrément donné par l'Organisme de Foncier Solidaire</li>
            <li>Le compromis de vente</li>
          </ul>
        `,
      },
    ],
    previousStep: step3,
    nextStep: step5,
  },
  {
    ...step5,
    sections: [
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
          <a class="fr-btn fr-mt-4w" href="/revendre-mon-bien-en-brs">
            Toutes les informations sur la revente en Bail Réel Solidaire (BRS)
          </a>
        `,
      },
    ],
    previousStep: step4,
  },
];
