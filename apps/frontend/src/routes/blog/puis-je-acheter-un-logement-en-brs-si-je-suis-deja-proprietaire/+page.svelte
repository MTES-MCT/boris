<script lang="ts">
  import ArticlePage from '$components/pages/blog/ArticlePage.svelte';
  import type { ArticlePreview } from '$lib/utils/definitions';
  import { articles } from '$routes/blog/articles';

  const article = articles.find(
    (article) =>
      article.slug ===
      'puis-je-acheter-un-logement-en-brs-si-je-suis-deja-proprietaire',
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
    Le dispositif de Bail Réel Solidaire (BRS) existe pour faciliter l’accès à
    la propriété pour des personnes qui auraient des difficultés à acheter leur
    résidence principale dans le marché libre. Dans la plupart des situations,
    les ménages concernés sont actuellement locataires (logement social ou
    logement du parc privé) ou hébergés, mais il peut arriver que certains
    propriétaires souhaitent acheter un logement en Bail Réel Solidaire, car
    leur logement actuel ne répond pas ou plus à leurs besoins.
  </p>
  <p>
    Dans ce dernier cas, et depuis le 1er janvier 2025, s'applique une nouvelle
    condition d'éligibilité pour les personnes qui souhaitent acheter en BRS.
    Cette nouvelle condition vise à préserver l’objectif social et solidaire de
    ce mode d'accession à la propriété. Ainsi si vous êtes déjà propriétaire,
    êtes-vous éligible au Bail Réel Solidaire ? Nous vous proposons de répondre
    à cette question dans cet article.
  </p>

  <h2><b>Que dit la réglementation ?</b></h2>

  <p>
    Tout d’abord regardons ensemble ce que dit le décret du 16 juillet 2024 sur
    le sujet. Les dispositions de l’article R.255-1-1 du Code de la Construction
    et de l’Habitation indiquent qu’un ménage acquéreur d’un logement en Bail
    Réel Solidaire (BRS) ne doit pas posséder au moment de l’achat :
  </p>
  <ol>
    <li>
      un logement adapté à ses besoins et capacités financières, qu’il peut
      utiliser comme résidence principale ;
    </li>
    <li>
      un logement qu’il propose à la location, susceptible de lui procurer des
      revenus suffisants pour acquérir un bien immobilier du parc privé.
    </li>
  </ol>
  <p>
    L’une ou l’autre condition étant suffisante pour que le ménage ne soit pas
    éligible au dispositif.
  </p>

  <h2><b>Est-ce que cela s’applique à moi ?</b></h2>

  <p>
    Pour savoir si vous êtes dans l’un de ces deux cas de figure, il convient
    pour vous de vérifier plusieurs points :
  </p>
  <ul>
    <li>
      Le logement dont vous êtes propriétaire est-il votre résidence principale
      ? Et si oui pourquoi souhaitez-vous devenir acquéreur en BRS ?
    </li>
  </ul>
  <p>
    Si votre propriété est déjà votre résidence principale, et qu’elle répond
    déjà à vos besoins (propriété décente, suffisamment grande pour accueillir
    l’ensemble de votre foyer, distance acceptable par rapport à votre lieu de
    travail, etc) alors vous n’êtes pas éligible au Bail Réel Solidaire. Si par
    contre votre propriété est votre résidence principale, mais que celle-ci
    n’est pas décente, trop petite pour votre foyer, trop éloignée de votre lieu
    de travail ou que votre situation évolue (décohabitation, décès,
    agrandissement de votre foyer, mutation, etc), ou alors que le maintien de
    cette propriété vous met en difficulté financièrement, alors considérez que
    votre logement n’est pas adapté à vos besoins et vos capacités financières
    et que vous êtes éligible au Bail Réel Solidaire. Cela bien sûr, si vos
    ressources sont inférieures au plafond réglementaire (
    <a
      href="/simulateur-eligibilite"
      class="fr-link">
      à vérifier avec notre simulateur
    </a>
    ).
  </p>
  <ul>
    <li>
      Le logement dont vous êtes propriétaire, mis en location, permet-il
      d’avoir des revenus complémentaires suffisants pour acheter dans le marché
      libre ?
    </li>
  </ul>
  <p>
    Si les revenus locatifs générés par votre propriété sont suffisants, en
    complément de vos revenus mensuels, pour prétendre à l’achat d’un logement
    dans le marché libre adapté à votre situation (logement décent, d’une taille
    suffisante pour votre foyer, distance acceptable par rapport à votre lieu de
    travail), alors vous n’êtes pas éligible au dispositif BRS. Si par contre,
    malgré vos recherches, vous ne trouvez pas de logement qui vous est adapté
    dans le marché libre, ou bien que ces derniers ne sont pas à votre portée
    (par exemple si vous n’arrivez pas à obtenir de prêt auprès d’une banque),
    alors vous êtes éligible au Bail Réel Solidaire. Cela, si vos ressources
    sont inférieures au plafond réglementaire (
    <a
      href="/simulateur-eligibilite"
      class="fr-link">
      à vérifier avec notre simulateur
    </a>
    ).
  </p>

  <h2>
    <b>Qu’est-ce que cela implique pour moi ?</b>
  </h2>

  <p>
    Ainsi, si en tant que propriétaire vous êtes éligible au dispositif, et que
    vous poursuivez votre projet d’achat en BRS, vous devrez, au moment de la
    signature de l’acte de vente, signer une attestation sur l’honneur indiquant
    que vous n’êtes pas dans l’une des deux configurations citées ci-dessus. Un
    modèle d’attestation vous sera fourni par le ou la professionnel.le de
    l’immobilier avec qui vous serez en contact lors de votre achat.
  </p>
  <p>
    Vous êtes éligible ? <a
      href="https://boris.beta.gouv.fr/organismes-fonciers-solidaires">
      Contactez dès à présent les OFS ou leurs commercialisateurs dans votre
      région de recherche pour voir les biens disponibles
    </a>
    .
  </p>
</ArticlePage>
