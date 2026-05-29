<script lang="ts">
  import type { ArticlePreview } from '$lib/utils/definitions';
  import { articles } from '$routes/blog/articles';

  import ArticlePage from '$components/pages/blog/ArticlePage.svelte';
  import Table from '$components/common/Table.svelte';

  const article = articles.find(
    (article) => article.slug === 'la-succession-en-bail-reel-solidaire-brs',
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
    Le Bail Réel Solidaire (BRS) permet à des ménages aux revenus modestes de
    devenir propriétaires de leur logement tout en conservant un prix d'achat
    accessible. <br />
    Mais que devient un logement en bail réel solidaire en cas de décès du propriétaire
    ?
    <br />
    Quelles sont les règles d'héritage bail réel solidaire ?
    <br />
    Quels sont les droits des héritiers ?
    <br />
    Peut-on transmettre un bien en BRS à ses enfants ou à un proche ?
  </p>

  <h2 class="fr-mt-8w">
    La succession en bail réel solidaire est possible, mais encadrée.
  </h2>
  <p>
    Lorsqu'un ménage est propriétaire d'un logement en BRS, <b>
      il partage la propriété avec
      <a
        href="/organismes-de-foncier-solidaire"
        class="fr-link">
        l'organisme de foncier solidaire (OFS)
      </a>
    </b>
    .
    <br />
    <b>La succession en bail réel solidaire est donc possible.</b>
    <br />
    La succession d'un logement en bail réel solidaire (BRS) est également
    <b>
      encadrée quant à la possibilité de conserver le bien en BRS ou
      l'obligation de revente
    </b>
    .
    <br />
    On vous en dit plus ci-dessous.
  </p>

  <h2 class="fr-mt-8w">Qui peut hériter d'un logement en BRS ?</h2>
  <p>
    Comme pour tout bien immobilier, le logement acquis en BRS <b>
      entre dans la succession du propriétaire
    </b>
    .
    <br />
    Les règles de droit commun s'appliquent :
    <b>les héritiers légaux</b>
    (enfants, conjoint, etc.)
    <b>ou désignés par testament</b>
    peuvent recevoir le bien, au même titre que ses autres biens.
  </p>
  <p class="fr-mb-0">
    Cependant, les contreparties du dispositif s'appliquent aussi aux héritiers,
    s'ils souhaitent conserver le logement :
  </p>
  <ul>
    <li>
      <p class="fr-mb-1w">
        <b>Les héritiers doivent respecter les plafonds de ressources BRS</b>
        en vigueur au moment de la succession.
      </p>
      <p class="fr-mb-0">
        Simulez votre éligibilité au BRS pour voir si vous pourriez prétendre à
        la conservation du bien.
      </p>
      <a
        href="/simulateur-eligibilite"
        class="fr-btn fr-my-2w">
        Je fais le test
      </a>
      <p>
        Il existe une seule exception à cette condition d'éligibilité : le cas
        où le ou la conjoint·e est l'héritier·e du logement, quel que soit le
        régime matrimonial.
      </p>
    </li>
    <li>
      <b>
        Les héritiers doivent utiliser le logement comme résidence principale.
      </b>
    </li>
  </ul>
  <p class="fr-mt-4w">
    Si l'un des héritiers remplit ces deux conditions, il peut <b>
      continuer à occuper le bien dans les conditions du bail réel solidaire
      (BRS)
    </b>
    . Les autres héritiers (non éligibles ou ne souhaitant pas vivre dans le logement)
    devront dans ce cas lui revendre ou lui donner leur part.
  </p>

  <h2 class="fr-mt-8w">
    Et si aucun héritier n'est éligible au Bail Réel Solidaire (BRS) ou qu'aucun
    ne souhaite vivre dans le logement ?
  </h2>
  <p>
    Dans ce cas, le logement <b>doit être revendu dans les 12 mois</b>
    , selon les conditions encadrées par le BRS.
  </p>
  <p>
    C'est <a
      href="/organismes-de-foncier-solidaire"
      class="fr-link">
      l'organisme de foncier solidaire (OFS)
    </a>
    qui accompagne les héritiers dans cette démarche. Le logement est alors
    <b>remis sur le marché à prix encadré</b>
    , pour être racheté par un autre ménage éligible.
  </p>
  <p>
    Si les héritiers n'arrivent pas à céder le logement dans ce délai de 12
    mois, <a
      href="/organismes-de-foncier-solidaire"
      class="fr-link">
      l'organisme de foncier solidaire (OFS)
    </a>
    peut le prolonger. Si à terme, les héritiers ne trouvent pas d'acquéreurs, alors
    le BRS peut être résilié de façon conventionnelle,
    <a
      href="/organismes-de-foncier-solidaire"
      class="fr-link">
      l'organisme de foncier solidaire (OFS)
    </a>
    récupère la pleine propriété du logement et il indemnise les héritiers selon
    les conditions définies dans le bail.
  </p>
  <p>
    Pour tout savoir sur les règles et étapes de la revente, consultez notre
    page dédiée : <a
      href="/revendre-mon-bien-en-brs"
      class="fr-link">
      👉 Revente d'un logement en BRS.
    </a>
  </p>

  <h2 class="fr-mt-8w">
    Vous êtes confronté à un cas de succession en BRS ? Voici les démarches à
    connaître.
  </h2>
  <p>
    Si vous êtes héritier d'un logement en bail réel solidaire (BRS), il est
    recommandé de :
  </p>
  <ul>
    <li>
      Contacter rapidement <a
        href="/organismes-de-foncier-solidaire"
        class="fr-link">
        l'organisme de foncier solidaire (OFS)
      </a>
      concerné
    </li>
    <li>
      Vérifier votre
      <a
        href="/simulateur-eligibilite"
        class="fr-link">
        éligibilité au bail réel solidaire via notre simulateur
      </a>
    </li>
    <li>
      Vous informer sur les
      <a
        href="/revendre-mon-bien-en-brs"
        class="fr-link">
        modalités de revente en bail réel solidaire (BRS)
      </a>
      si besoin
    </li>
  </ul>

  <h2 class="fr-mt-8w">📌 En résumé</h2>
  <Table
    theads={['Situation des héritiers', 'Conséquence']}
    tbodies={[
      [
        `✅ Éligibles au BRS <br />
      (Test d'éligibilité
      <a href="/simulateur-eligibilite" class="fr-link fr-text--sm">ICI</a>)`,
        `✅ Vous héritez du logement en bail réel solidaire
      <br />
      ✅ Vous avez la possibilité de conserver le bien en respectant
      les conditions du BRS
      <ul>
        <li>Obligation d'user du bien à titre de résidence principale</li>
        <li>Le ménage doit être agréé par <a href="/organismes-de-foncier-solidaire" class="fr-link fr-text--sm">l'organisme de foncier solidaire (OFS)</a></li>
        <li>👉 <a href="/tout-savoir-sur-le-bail-reel-solidaire-brs/je-decouvre-le-dispositif" class="fr-link fr-text--sm">Les règles en BRS</a></li>
      </ul>
      Vous avez aussi la possibilité de vendre le logement
      <a href="/revendre-mon-bien-en-brs" class="fr-link fr-text--sm">👉 Revente d'un logement en BRS.</a>`,
      ],
      [
        `<hr class="fr-my-4w" />❌ NON Éligibles au BRS <br />
      (Test d'éligibilité
      <a href="/simulateur-eligibilite" class="fr-link fr-text--sm">ICI</a>)`,
        `<hr class="fr-my-4w" />✅ Vous héritez du logement en bail réel solidaire
      <br />
      ❌ Il vous est IMPOSSIBLE de conserver le bien en bail réel
      solidaire → Obligation de revendre le bien
      <br />
      <ul>
        <li>Le bien doit être revendu selon les règles du BRS</li>
        <li><a href="/revendre-mon-bien-en-brs" class="fr-link fr-text--sm">👉 Revente d'un logement en BRS.</a></li>
      </ul>`,
      ],
    ]} />

  <h2 class="fr-mt-8w">📌 Pour aller plus loin</h2>
  <ul>
    <li>
      <a
        href="/tout-savoir-sur-le-bail-reel-solidaire-brs/je-decouvre-le-dispositif"
        class="fr-link">
        🔎 Comprendre le fonctionnement du BRS
      </a>
    </li>
    <li>
      <a
        href="/simulateur-eligibilite"
        class="fr-link">
        🏠 Vérifiez votre éligibilité au BRS
      </a>
    </li>
    <li>
      <a
        href="/revendre-mon-bien-en-brs"
        class="fr-link">
        🔄 Les règles de revente d'un bien en BRS
      </a>
    </li>
  </ul>

  <p>
    Vous avez une question spécifique sur votre situation ou celle d'un proche ?
    Vous avez des questions spécifiques à la revente d'un bien en BRS ?
  </p>

  <p>
    Contactez un <a
      href="/organismes-de-foncier-solidaire"
      class="fr-link">
      organisme de foncier solidaire (OFS)
    </a>
    proche de chez vous.
  </p>

  <p>
    Vous avez acheté en BRS et vous ne connaissez plus le nom de votre OFS ?
    Retrouvez qui est votre OFS <a
      href="/organismes-de-foncier-solidaire"
      class="fr-link">
      ici
    </a>
    !
  </p>
</ArticlePage>
