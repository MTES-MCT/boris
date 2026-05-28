<script lang="ts">
  import Table from '$components/common/Table.svelte';
  import ArticlePage from '$components/pages/blog/ArticlePage.svelte';
  import type { ArticlePreview } from '$lib/utils/definitions';
  import { articles } from '$routes/blog/articles';

  const article = articles.find(
    (article) =>
      article.slug ===
      'les-inconvenients-ou-contreparties-du-bail-reel-solidaire-brs',
  ) as ArticlePreview;
</script>

<ArticlePage {article}>
  <p>
    Le bail réel solidaire (BRS) est un excellent levier pour accéder à la
    propriété qui permet d'acheter son logement 30 à 50% moins cher et de
    bénéficier de frais annexes allégés (TVA réduite à 5,5%, prêt à taux zéro si
    vous y êtes éligible…) afin de devenir propriétaire à prix maîtrisé.
  </p>
  <p>
    Avant de se lancer dans un projet d'achat en bail réel solidaire, il est
    important de comprendre comment ces avantages peuvent exister, et ainsi de
    connaître les contreparties.
  </p>
  <p class="fr-text--bold !mb-0">
    Pourquoi parle-t-on de contreparties plutôt que d'inconvénients du bail réel
    solidaire ?
  </p>
  <ul>
    <li>
      Un inconvénient est un terme qui suggère un désavantage injustifié, une
      limitation unilatérale.
    </li>
    <li>
      Une contrepartie traduit une relation équilibrée : un avantage accordé en
      échange d'un engagement.
    </li>
  </ul>
  <p>
    Voici donc les contreparties que vous devrez respecter lorsque vous devenez
    propriétaire en bail réel solidaire, pour bénéficier des avantages du
    dispositif BRS (acheter 30 à 50% moins cher, TVA réduite, prêt à taux
    zéro…).
  </p>

  <h2 class="fr-mt-8w">
    1er inconvénient/contrepartie : Des conditions d'éligibilité s'appliquent
  </h2>
  <p>
    Les critères d'éligibilité permettent d'assurer la vocation sociale du
    dispositif. Pour acheter en bail réel solidaire (brs) vous devez respecter
    ces conditions d'éligibilité.
  </p>
  <ul>
    <li>
      👉 Testez votre <a
        href="/simulateur-eligibilite"
        class="fr-link">
        éligibilité au bail réel solidaire
      </a>
    </li>
    <li>
      <a
        class="fr-link"
        href="/blog/puis-je-acheter-un-logement-en-brs-si-je-suis-deja-proprietaire">
        Si vous êtes déjà propriétaire et souhaitez acheter un bien en bail réel
        solidaire
      </a>
      , consultez notre article dédié.
    </li>
  </ul>

  <h2 class="fr-mt-8w">
    2ème inconvénient/contrepartie : Vous devez verser une redevance mensuelle
  </h2>
  <p>
    Même si elle est contenue, la redevance versée à <a
      href="/organismes-de-foncier-solidaire"
      class="fr-link">
      l'organisme de foncier solidaire (OFS)
    </a>
    pour le terrain est
    <b>un coût à anticiper</b>
    dans votre budget global. La redevance en BRS peut varier de moins de 0,50 €/
    m² à plus de 3 €/m² en fonction des territoires.
  </p>
  <p>
    Cet “inconvénient” en bail réel solidaire est en réalité la contrepartie
    d'un achat 30 à 50% moins cher. La redevance permet à l'OFS de rembourser
    l'investissement qu'il a lui-même assuré pour diminuer le prix du logement
    lors de la première mise en vente. Ce prix de vente restera encadré pour les
    reventes successives, comme nous le voyons ci-dessous.
  </p>
  <ul>
    <li>
      👉
      <a
        href="/organismes-de-foncier-solidaire"
        class="fr-link">
        En savoir plus sur les Organismes de Foncier Solidaire (OFS)
      </a>
    </li>
    <li>
      👉
      <a
        href="/simulateur-acquisition"
        class="fr-link">
        Simulateur de coût d'acquisition en BRS
      </a>
      : ayez en tête tous les coûts liés à un achat en bail réel solidaire (BRS).
    </li>
  </ul>

  <h2 class="fr-mt-8w">
    3ème inconvénient/contrepartie : Le prix est encadré à la revente
  </h2>
  <p>
    Vous ne pourrez pas revendre au prix du marché libre. Cela limite la
    <b>plus-value potentielle</b>
    , mais
    <b>
      c'est aussi ce qui permet de garder le logement abordable sur le long
      terme
    </b>
    .
  </p>
  <p>
    Pour rappel : le bail réel solidaire est un dispositif qui a pour but de
    permettre l'accession à la propriété aux ménages modestes et moyens qui ne
    pourraient pas acheter dans le marché libre. Il est ainsi nécessaire
    d'encadrer les prix de revente afin d'assurer que ces logements restent
    abordables pour ces ménages dans 30, 50 ou 100 ans.
  </p>
  <p>
    👉 Mieux comprendre les règles de <a
      href="/revendre-mon-bien-en-brs"
      class="fr-link">
      revente en bail réel solidaire
    </a>
  </p>

  <h2 class="fr-mt-8w">
    4ème inconvénient/contrepartie : Moins de flexibilité
  </h2>
  <p class="!mb-0">
    En bail réel solidaire, des conditions d'usage s'appliquent:
  </p>
  <ul>
    <li>
      Le logement doit rester votre <b>résidence principale</b>
      . L'usage en résidence secondaire est exclu.
    </li>
  </ul>
  <p class="!mt-6 !mb-0">
    En bail réel solidaire, des règles encadrent la location:
  </p>
  <ul>
    <li>La location à l'année du logement est exclue.</li>
    <li>
      La location du logement sur une mineure partie de l'année peut être
      autorisée selon le contrat que vous avez signé. Renseignez-vous auprès de
      votre <a
        href="/organismes-de-foncier-solidaire"
        class="fr-link">
        Organisme de Foncier Solidaire
      </a>
      avant d'envisager une location.
    </li>
  </ul>
  <p class="!mt-6">
    Cette contrepartie existe encore une fois pour éviter de faire des logements
    en bail réel solidaires des objets d'investissements locatifs et de rente et
    pour favoriser l'achat de résidences principales et non secondaires dans des
    territoires très attractifs.
  </p>

  <h2 class="fr-mt-8w">
    5ème inconvénient/contrepartie : Une offre de logements en bail réel
    solidaire encore limitée mais en pleine expansion
  </h2>
  <p>
    Tous les territoires ne proposent pas encore de programmes en bail réel
    solidaire (BRS). <b>L'offre est en développement</b>
    , mais peut être limitée selon votre région.
  </p>
  <p>
    Pour <a
      href="/logements-brs-disponibles"
      class="fr-link">
      trouver un logement en bail réel solidaire
    </a>
    , nous vous invitons à consulter notre cartographie des villes qui proposent
    au moins une maison ou un appartement en bail réel solidaire à vendre. Vous pourrez
    ainsi être redirigé vers les sites qui proposent ces logements.
  </p>

  <h2 class="fr-mt-8w">
    En résumé, voici la liste des inconvénients ou exactement des contreparties
    du bail réel solidaire (BRS)
  </h2>
  <Table
    multiline
    theads={['Inconvénients', 'Explication', "Conséquence pour l'acquéreur"]}
    tbodies={[
      [
        "<b>Conditions d'éligibilité</b>",
        '<a href="/tout-savoir-sur-le-bail-reel-solidaire-brs#plafonds-de-ressources" class="fr-link fr-text--sm">Plafonds de revenus</a> et statut (ne pas être propriétaire sauf <a href="/blog/puis-je-acheter-un-logement-en-brs-si-je-suis-deja-proprietaire" class="fr-link fr-text--sm">exceptions</a>).',
        'Accès réservé à certains profils, possible exclusion si revenus trop élevés.',
      ],
      [
        '<b>Redevance mensuelle</b>',
        "Paiement d'une redevance à l'<a href='/organismes-de-foncier-solidaire' class='fr-link fr-text--sm'>organisme de foncier solidaire (OFS)</a> pour l'usage du terrain.",
        "Coût supplémentaire à intégrer, mais prix d'achat réduit de 30 à 50 %. Utilisez le <a href='/simulateur-acquisition' class='fr-link fr-text--sm'>simulateur de coût en BRS</a> pour bien considérer tous les coûts liés à un achat en BRS.",
      ],
      [
        '<b>Prix encadré à la revente</b>',
        "<a href='/revendre-mon-bien-en-brs' class='fr-link fr-text--sm'>Revente limitée</a> par un prix selon un calcul fixé à l'avance ",
        'La plus-value est possible mais pas la spéculation immobilière. Le logement en BRS a pour objectif de rester abordable pour les prochains acheteurs.',
      ],
      [
        '<b>Moins de flexibilité</b>',
        'Usage strictement en résidence principale. Location encadrée (partielle possiblement autorisée selon le contrat signé).',
        `Il est impossible d'acheter en BRS sa résidence secondaire. L'achat en bail réel solidaire (BRS) n'est pas adapté aux intérêts d'achat locatif. La location partielle est encadrée et peut être interdite (référez vous à votre contrat ou renseignez vous auprès de votre <a href="/organismes-de-foncier-solidaire" class="fr-link fr-text--sm">organisme de foncier solidaire</a>).`,
      ],
      [
        '<b>Offre encore limitée</b>',
        `Pas encore disponible partout en France mais en pleine expansion. Consultez ici les <a href="/logements-brs-disponibles" class="fr-link fr-text--sm">offres en BRS disponibles</a>.`,
        `L'accès dépend de la zone géographique. Référez-vous à <a href="/logements-brs-disponibles" class="fr-link fr-text--sm">la carte du bail réel solidaire en France</a> pour trouver un logement en bail réel solidaire (BRS).`,
      ],
    ]} />
  <p>
    Conclusion : Le bail réel solidaire (BRS) est un <b>
      compromis intelligent
    </b>
    , mais il faut bien comprendre le cadre avant de s'engager. Nous choisissons
    de parler de contreparties du bail réel solidaire (BRS), et non d'inconvénients
    du bail réel solidaire (BRS). Ce choix sémantique n'est pas anodin : il reflète
    la logique du dispositif, son équilibre et ses objectifs d'intérêt général.
  </p>
</ArticlePage>
