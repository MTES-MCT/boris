<script lang="ts">
  import ArticlePage from '$components/pages/blog/ArticlePage.svelte';
  import type { ArticlePreview } from '$lib/utils/definitions';
  import { articles } from '$routes/blog/articles';

  const article = articles.find(
    (article) =>
      article.slug === '5-idees-recues-sur-le-bail-reel-solidaire-brs',
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
    Le bail réel solidaire (BRS) est encore méconnu et souffre de quelques idées
    fausses. On fait le point.
  </p>
  <h2 class="fr-mt-8w">
    1. "C'est sûr que je ne suis pas éligible au bail réel solidaire (BRS)"
  </h2>
  <p
    class="fr-text--lg"
    style="color: var(--color-red-dark);">
    <b>Faux.</b>
  </p>
  <p>
    Le BRS cible <strong>les classes moyennes et modestes</strong>
    , souvent exclues de l'accession classique. Les plafonds sont proches de ceux
    du prêt à taux zéro. 87% des ménages en France sont éligibles, c'est donc probablement
    votre cas!
  </p>
  <p>
    <a
      href="/simulateur-eligibilite"
      class="fr-btn">
      Testez votre éligibilité au Bail Réel Solidaire (BRS)
    </a>
  </p>
  <h2 class="fr-mt-8w">
    2. "En bail réel solidaire, je ne serai pas vraiment propriétaire."
  </h2>
  <p
    class="fr-text--lg"
    style="color: var(--color-red-dark);">
    <b>Faux.</b>
  </p>
  <p>
    Vous êtes <strong>pleinement propriétaire de votre logement</strong>
    . Vous pouvez le transmettre à vos proches ou le vendre par exemple. Il existe
    par contre certaines conditions : le prix de revente est encadré et le preneur
    doit être éligible au bail réel solidaire (brs).
  </p>
  <p>
    Par ailleurs, en tant que propriétaire en bail réel solidaire (brs), vous
    partagez la propriété du logement avec un <a
      href="/organismes-de-foncier-solidaire"
      class="fr-link">
      organisme de foncier solidaire (OFS)
    </a>
    qui assume une partie du prix du logement à l'achat. C'est ce mécanisme qui diminue
    ce prix de 30 à 50% pour vous, par rapport au marché libre. En échange, ce sont
    les ménages propriétaires successifs qui reprennent cette charge financière sur
    le temps très long en payant chaque mois une redevance contenue à l'
    <a
      href="/organismes-de-foncier-solidaire"
      class="fr-link">
      organisme de foncier solidaire (OFS)
    </a>
    . Même si vous partagez cette propriété avec l'
    <a
      href="/organismes-de-foncier-solidaire"
      class="fr-link">
      organisme de foncier solidaire (OFS)
    </a>
    , ce dernier n'occupe pas ce logement à votre place. Vous devez par contre vous
    l'occuper comme résidence principale.
  </p>
  <h2 class="fr-mt-8w">
    3. "Le bail réel solidaire, c'est une location déguisée"
  </h2>
  <p
    class="fr-text--lg"
    style="color: var(--color-red-dark);">
    <b>Faux.</b>
  </p>
  <p>
    Le bail réel solidaire (brs) est un
    <strong>outil d'accession à la propriété</strong>
    , pas une location. Un Bail Réel Solidaire (brs) est conclu pour une durée de
    18 à 99 ans, mais à chaque vente ou transmission, cette durée repart à zéro.
    Ainsi, le dispositif a été imaginé pour proposer aux ménages une forme de propriété
    perpétuelle, comme pour un achat dans le libre.
  </p>
  <h2 class="fr-mt-8w">
    4. "Je ne pourrai jamais revendre en bail réel solidaire"
  </h2>
  <p
    class="fr-text--lg"
    style="color: var(--color-red-dark);">
    <b>Faux.</b>
  </p>
  <p>
    Comme indiqué plus haut,
    <strong>vous pouvez revendre à tout moment, à un prix encadré</strong>
    , à un ménage respectant les conditions d'éligibilité. Par ailleurs, plusieurs
    entités peuvent vous accompagner lors de votre revente, afin de s'assurer de
    son succès. En effet, l'objectif de l'Etat, des collectivités territoriales et
    des
    <a
      href="/organismes-de-foncier-solidaire"
      class="fr-link">
      organismes de foncier solidaire (OFS)
    </a>
    est de pouvoir proposer une offre de logements abordables dans le temps et donc
    de sécuriser les ménages propriétaires en Bail Réel Solidaires (BRS).
  </p>
  <p>
    <a
      href="/revendre-mon-bien-en-brs"
      class="fr-link">
      Plus d'informations sur la revente en BRS
    </a>
  </p>
  <h2 class="fr-mt-8w">
    5. "Le bail réel solidaire, c'est un dispositif compliqué."
  </h2>
  <p
    class="fr-text--lg"
    style="color: var(--color-red-dark);">
    <b>Faux.</b>
  </p>
  <p>
    Le BRS, c'est <strong>simple et encadré</strong>
    par l'Etat, avec des
    <a
      href="/organismes-de-foncier-solidaire"
      class="fr-link">
      organismes de foncier solidaire (OFS)
    </a>
    - ou les entités mandatées par ces derniers - qui vous accompagnent. Toute l'information
    est également expliquée sur
    <a
      href="/"
      class="fr-link">
      BoRiS
    </a>
    , plateforme officielle du gouvernement sur le Bail Réel Solidaire (BRS).
  </p>
</ArticlePage>
