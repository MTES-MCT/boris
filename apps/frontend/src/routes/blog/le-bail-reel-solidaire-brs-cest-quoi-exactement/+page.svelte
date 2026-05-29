<script lang="ts">
  import ArticlePage from '$components/pages/blog/ArticlePage.svelte';
  import type { ArticlePreview } from '$lib/utils/definitions';
  import { articles } from '$routes/blog/articles';

  const article = articles.find(
    (article) =>
      article.slug === 'le-bail-reel-solidaire-brs-cest-quoi-exactement',
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
    <b>Le Bail Réel Solidaire (BRS), c'est quoi exactement?</b>
    Le bail réel solidaire (BRS) est un dispositif innovant qui vise à faciliter
    l'accession à la propriété pour les ménages aux revenus modestes et moyens. Créé
    par la loi n° 2015-990 du 6 août 2015 pour répondre à la forte hausse des prix
    des logements depuis 2000, il repose sur un principe simple mais puissant :
    <b>
      devenir propriétaire en réduisant le coût d'achat d'un bien immobilier.
      Ceci étant possible, en partageant la propriété avec <a
        href="/organismes-de-foncier-solidaire"
        class="fr-link">
        l'organisme de foncier solidaire (OFS)
      </a>
      .
    </b>
  </p>
  <p class="fr-mt-6w fr-mb-1w">
    <b>Un organisme de foncier solidaire (OFS) c'est quoi?</b>
  </p>
  <p>
    <a
      href="/organismes-de-foncier-solidaire"
      class="fr-link">
      L'organisme de foncier solidaire (OFS)
    </a>
    est un organisme, agréé par l'Etat, créé par la loi ALUR en 2014, à but non lucratif,
    qui acquiert et détient des terrains qui accueillent des programmes en Bail Réel
    Solidaire (BRS). Sur ces terrains, l'organisme de doncier solidaire (OFS) produit
    des logements, qui seront vendus en Bail Réel Solidaire (BRS) aux ménages
    <a
      href="/simulateur-eligibilite"
      class="fr-link">
      éligibles
    </a>
    .
  </p>

  <a
    href="/organismes-de-foncier-solidaire"
    class="fr-btn">
    En savoir plus sur les organismes de foncier solidaire (OFS)
  </a>

  <h2 class="fr-mt-8w">
    <b>🔄 Comment fonctionne le Bail Réel Solidaire (BRS)?</b>
  </h2>

  <p>
    Le ménage est pleinement propriétaire du logement (appartement ou maison),
    et partage la propriété avec un <a
      href="/organismes-de-foncier-solidaire"
      class="fr-link">
      organisme de foncier solidaire (OFS)
    </a>
    . L'achat en bail réel solidaire (BRS) permet au ménage d'acheter son logement
    30 à 50% moins cher que dans le marché libre. En contrepartie, l'acquéreur verse
    une redevance contenue à
    <a
      href="/organismes-de-foncier-solidaire"
      class="fr-link">
      l'organisme de foncier solidaire (OFS)
    </a>
    , pour l'usage du sol. Ainsi, la charge financière est partagée entre
    <a
      href="/organismes-de-foncier-solidaire"
      class="fr-link">
      l'organisme de foncier solidaire (OFS)
    </a>
    et le ménage, puisque
    <a
      href="/organismes-de-foncier-solidaire"
      class="fr-link">
      l'organisme de foncier solidaire (OFS)
    </a>
    prend pour sa part 30 à 50% du prix du logement lors de la première cession,
    et ce sont les ménages propriétaires successifs qui payeront, petit à petit,
    sur le temps très long, cette charge via la redevance. Pour vous projeter sur
    le financement d'un achat en Bail Réel Solidaire (BRS),
    <a
      href="/blog/un-exemple-pour-vous-projeter-dans-votre-achat-en-brs"
      class="fr-link">
      n'hésitez pas à lire notre article dédié ici.
    </a>
  </p>

  <h2 class="fr-mt-8w">
    <b>👥 Qui peut bénéficier d'un achat en bail réel solidaire?</b>
  </h2>

  <p>Le Bail réel solidaire (BRS) est réservé aux ménages :</p>

  <ul>
    <li>
      Sous <b>plafond de ressources</b>
      , variables selon la zone géographique. Consultez notre page indiquant
      <a
        href="/simulateur-eligibilite#plafonds-de-ressources"
        class="fr-link">
        les plafonds de ressources
      </a>
      .
    </li>
    <li>
      Qui ne sont <b>
        pas déjà propriétaire d’un logement adapté à leurs besoins
      </b>
      , ou susceptible de procurer des revenus suffisants pour un achat dans le marché
      libre (plus d’informations dans notre article:
      <a
        href="/blog/puis-je-acheter-un-logement-en-brs-si-je-suis-deja-proprietaire"
        class="fr-link">
        “Puis-je acheter un logement en BRS si je suis déjà propriétaire?”
      </a>
      ).
    </li>
    <li>
      Pour un <b>
        logement occupé en résidence principale (8 mois au moins dans l’année)
      </b>
    </li>
  </ul>

  <a
    href="/simulateur-eligibilite"
    class="fr-link fr-btn fr-mt-4w">
    Testez votre éligibilité
  </a>

  <h2 class="fr-mt-8w">
    <b>✅ Quels sont les avantages du bail réel solidaire (BRS)?</b>
  </h2>

  <p>On note deux principaux avantages en BRS:</p>

  <ul>
    <li>
      Prix d’achat <b>réduit de 30 à 50 %</b>
      par rapport au marché classique
    </li>
    <li>
      <b>Stabilité résidentielle</b>
      avec une
      <b>pleine propriété</b>
      .
    </li>
  </ul>

  <h2 class="fr-mt-8w">
    <b>
      ⚖️ Quelles sont les inconvénients - ou plutôt les contreparties - du bail
      réel solidaire?
    </b>
  </h2>

  <p>
    Lors de l’accession d’un logement en bail réel solidaire (BRS), des
    conditions s’appliquent. Ces conditions, souvent appelées “
    <a
      href="/blog/les-inconvenients-ou-contreparties-du-bail-reel-solidaire-brs"
      class="fr-link">
      inconvénients du bail réel solidaire
    </a>
    ” sont en réalité des contreparties. En effet, un inconvénient est un terme renvoyant
    vers une idée négative ou un obstacle. Une contrepartie traduit une relation
    équilibrée : un avantage accordé en échange d’un engagement.
  </p>

  <p>Voici les contreparties d’un achat en Bail Réel Solidaire :</p>

  <ul>
    <li>
      <p>
        <b>Encadrement de la revente:</b>
      </p>
      <ul>
        <li>Prix encadré pour éviter la spéculation immobilière</li>
        <li>
          Obligation de <b>revente à un ménage éligible</b>
          à l’achat en Bail Réel Solidaire (ménage sous les
          <a
            href="/simulateur-eligibilite#plafonds-de-ressources"
            class="fr-link">
            plafond de ressources
          </a>
          ). Consultez l’article dédié à la
          <a
            href="/revendre-mon-bien-en-brs"
            class="fr-link">
            revente d’un bien en bail réel solidaire
          </a>
          .
        </li>
      </ul>
    </li>
    <li>
      Obligation de faire de ce logement sa <b>résidence principale</b>
    </li>
    <li>
      <b>
        Engagement à verser une redevance à l’Organisme de Foncier Solidaire
      </b>
    </li>
  </ul>

  <p>
    Vous trouverez plus d’information sur notre article dédié aux <a
      href="/blog/les-inconvenients-ou-contreparties-du-bail-reel-solidaire-brs"
      class="fr-link">
      inconvénients du BRS
    </a>
    - appelé
    <a
      href="/blog/les-inconvenients-ou-contreparties-du-bail-reel-solidaire-brs"
      class="fr-link">
      contreparties du Bail Réel Solidaire
    </a>
    .
  </p>

  <p>
    Si ces contreparties peuvent vous apparaître comme étant des contraintes,
    elles ont aussi été pensées pour permettre la création d’une offre de
    logements durablement abordables sur le temps long, pour des personnes qui
    ne pourraient pas devenir propriétaires dans le marché libre. Ainsi les
    différents ménages successivement propriétaires d’un logement en Bail Réel
    Solidaire (BRS) sont aussi solidaires entre eux.
  </p>

  <h2 class="fr-mt-8w">
    <b>📍Où trouver un logement en Bail réel solidaire (BRS)?</b>
  </h2>
  <p>
    De plus en plus de programmes immobiliers intègrent le Bail réel solidaire
    (BRS). Vous pouvez consulter la
    <a
      href="/organismes-de-foncier-solidaire"
      class="fr-link">
      liste des organismes de foncier solidaire (OFS) agréés
    </a>
    sur BoRiS pour trouver un projet près de chez vous.
  </p>
</ArticlePage>
