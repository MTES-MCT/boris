<script lang="ts">
  import ArticlePage from '$components/pages/blog/ArticlePage.svelte';
  import type { ArticlePreview } from '$lib/utils/definitions';
  import { articles } from '$routes/blog/articles';

  const article = articles.find(
    (article) =>
      article.slug === 'un-exemple-pour-vous-projeter-dans-votre-achat-en-brs',
  ) as ArticlePreview;
</script>

<svelte:head>
  <title>{article?.title}</title>
  <meta
    name="description"
    content={article?.description} />
</svelte:head>

<ArticlePage {article}>
  <p>
    Imaginons que vous avez repéré un appartement NEUF de 70 m² en BRS à 210.000
    euros à Lyon.
  </p>
  <p>
    Voici un calcul pour savoir si cela est plus intéressant que de rester
    locataire. Dans cet exemple, nous prenons un ménage primo-accédant de 3
    personnes avec un revenu fiscal de référence pour l'année N-2 de 50.000
    euros et qui dispose de ressources mensuelles (salaires) égales à 4 500 €.
  </p>
  <h2><b>Utilisation de votre apport</b></h2>
  <p>
    Imaginons que vous avez un apport de 20.000 €, soit un peu moins de 10% du
    prix du bien. Une partie de cet apport devra être affectée directement aux
    coûts annexes que sont les frais de notaires (4 830 €), les frais de
    cautionnement pour votre futur emprunt (environ 2 100 €) et de potentiels
    frais de dossier (environ 1 000 €). Il vous reste ainsi environ 12 000 €
    d'apport pour l'achat de votre appartement, à compléter par des emprunts et
    des aides.
  </p>
  <p><b>Emprunts</b></p>
  <p>
    Il vous reste ainsi 198 000 € à emprunter. L'appartement étant neuf et
    puisqu'il s'agit pour vous d'une primo-accession, vous êtes éligible au Prêt
    à Taux Zéro (PTZ). Ce dernier peut vous apporter 84 000 €, qu'il faudra
    compléter par un prêt usuel d'une banque pour chercher les 126 000 €
    restants. Les taux en vigueur pour ce type de prêt sont à l'heure où nous
    écrivons ces lignes à hauteur de 3,5%. Nous ne prenons pas d'autres aides
    dans notre cas d'étude, comme
    <a
      href="https://www.actionlogement.fr/le-pret-accession"
      class="fr-link"
      target="_blank">
      celle d'Action Logement pour les salarié·es du privé
    </a>
    ou des prêts conventionnés par certaines banques mais celles-ci existent.
  </p>
  <h2><b>Coût mensuel</b></h2>
  <p>
    En fonction de la durée de remboursement de vos deux prêts combinés, vos
    mensualités seront plus ou moins élevées. Par exemple, pour <b>
      des prêts d'une durée de 25 ans, il faut rembourser à la banque 890,05 €
      par mois. Sur 20 ans, les mensualités seront par exemple de 1 031,10 €.
    </b>
    Dans ces deux cas, les mensualités à rembourser sont bien inférieures à 35% de
    vos ressources mensuelles, qui est le plafond réglementaire au-dessus duquel
    une banque ne peut pas vous faire de prêt.
    <a
      href="https://www.calcul-ptz.fr/lissage.html"
      class="fr-link"
      target="_blank">
      Un site existe pour faire votre propre simulation.
    </a>
  </p>
  <p>
    Au-delà de ces mensualités, vous devrez chaque mois payer une redevance
    auprès de l'Organisme Foncier Solidaire (OFS) avec qui vous partagez la
    propriété de votre logement. Cette redevance mensuelle peut être très
    variable en fonction du marché immobilier dans lequel se trouve votre
    logement. A Lyon, par exemple, pour un appartement de 70 m² celle-ci peut
    monter jusque 210€/mois et le paiement de cette redevance ne s'arrête que si
    vous revendez votre logement ou le transmettez à vos proches.
  </p>
  <p>
    De plus, en tant que propriétaire, vous aurez probablement à payer des
    charges de copropriétés ainsi que la taxe foncière et vous serez dans
    l'obligation d'assurer votre logement. Ces montants sont variables en
    fonction des communes de résidence et des copropriétés mais peuvent
    atteindre quelques centaines d'euros. Ces charges peuvent être payées
    annuellement mais nous les lisserons sur 12 mois pour vous donner une idée
    global d'un coût mensuel.
  </p>
  <p>En résumé, voici le coût de votre logement, chaque mois :</p>
  <ul>
    <li>Mensualités de remboursement de prêt : 890,05€ (sur 25 ans)</li>
    <li>
      Redevance auprès de l'OFS : 210 € (donnée de façon indicative, ce montant
      peut être inférieur)
    </li>
    <li>
      Taxe foncière, charges de copropriétés, et assurance habitation lissées
      sur 12 mois : 300 € (donnée de façon indicative, ces montants peuvent être
      inférieurs)
    </li>
    <li><b>Total : 1 400 €/mois</b></li>
  </ul>
  <p>
    A titre de comparaison, une location à Lyon sur un appartement similaire
    vous reviendrait en moyenne à 1 190€/mois HORS CHARGES et peut facilement
    monter à 1 400 – 1 500 € en comprenant toutes les charges et assurance.
  </p>
  <p>
    Sauf qu'ici vous finissez propriétaire de votre logement et pourrez le
    revendre pour utiliser votre capital pour acheter un nouveau bien ou le
    transmettre à vos proches.
  </p>
  <h2><b>Projection sur plusieurs années</b></h2>
  <p>
    Par exemple, vous vivez 8 ans dans ce logement et que votre situation change
    (heureux événement, mutation, etc). Vous aurez déjà remboursé 85 444,80 € de
    vos prêts et il vous restera 124 555,20 € à rembourser. Vous revendez votre
    logement à 210 000 € (soit au même montant que lors de votre achat). Si nous
    déduisons tout ce qu'il vous reste à rembourser, vous avez maintenant une
    épargne de 85 000 €, soit 4 fois plus que lors de votre achat initial. Vous
    avez réussi à mettre de l'argent de côté pendant 8 ans tout en vivant dans
    un logement confortable.
  </p>
  <p>
    Vous pourrez maintenant utiliser cet argent comme apport pour acheter un
    logement plus grand ou plus proche de votre lieu de travail par exemple.
    Vous avez par ailleurs contribué à éviter la hausse des prix de l'immobilier
    puisque vous avez revendu votre logement à un ménage dans le besoin au même
    prix.
  </p>
  <p>
    Si vous avez d'autres questions sur le dispositif BRS, nous vous invitons à
    visiter cette
    <a
      href="/tout-savoir-sur-le-bail-reel-solidaire-brs"
      class="fr-link">
      page
    </a>
    !
  </p>
</ArticlePage>
