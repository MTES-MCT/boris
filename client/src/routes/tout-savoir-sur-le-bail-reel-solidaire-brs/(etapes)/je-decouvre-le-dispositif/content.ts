import type { StepSection } from '$lib/utils/definitions';

export const sections: StepSection[] = [
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
      <a href="/simulateur-eligibilite" class="fr-btn fr-btn--lg">Suis-je éligible ?</a>
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
      <a href="/organismes-fonciers-solidaires" class="fr-btn fr-btn--lg">
        Prendre contact pour trouver un logement en BRS
      </a>
    `,
  },
];
