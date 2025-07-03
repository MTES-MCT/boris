<script lang="ts">
  import ArticlePage from '$components/pages/blog/ArticlePage.svelte';
  import type { ArticlePreview } from '$lib/utils/definitions';
  import { articles } from '$routes/blog/articles';

  const article = articles.find(
    (article) =>
      article.slug ===
      'comment-savoir-si-je-suis-eligible-au-bail-reel-solidaire-brs',
  ) as ArticlePreview;
</script>

<svelte:head>
  <title>{article?.title}</title>
  <meta
    name="description"
    content={article?.description} />
</svelte:head>

<ArticlePage {article}>
  <h2 class="fr-mt-8w">
    📝 Voici les critères à remplir pour être éligible au bail réel solidaire
    (brs):
  </h2>
  <ol>
    <li>
      <p class="fr-mb-0">
        Être <strong>locataire</strong>
        OU
      </p>
      <p class="fr-mb-1w">
        Être
        <strong>
          propriétaire d'un logement actuel qui ne répond pas ou plus à votre
          besoin.
        </strong>
      </p>
      <p>
        Si vous êtes déjà propriétaire d'un logement et vous souhaitez acheter
        en Bail Réel Solidaire, référez vous à l'article
        <a
          href="/blog/puis-je-acheter-un-logement-en-brs-si-je-suis-deja-proprietaire"
          class="fr-link">
          Puis-je acheter un logement en BRS si je suis déjà propriétaire ?
        </a>
      </p>
    </li>

    <li>
      <p>
        Acheter pour faire de ce logement votre
        <strong>résidence principale</strong>
      </p>
    </li>

    <li>
      <p class="fr-mb-1w">
        Respecter des <strong>plafonds de revenus</strong>
        (ex : Zone A - 1 pers : 38 508 €, Zone B1 - 2 pers : 57 555 €...)
      </p>
      <p>
        Vous pouvez
        <a
          href="/simulateur-eligibilite#plafonds-de-ressources"
          class="fr-link">
          consulter les plafonds de ressources en bail réel solidaire ici
        </a>
        .
      </p>
    </li>
  </ol>
  <p>
    <a
      href="/simulateur-eligibilite"
      class="fr-btn">
      Accédez au simulateur officiel BoRiS
    </a>
  </p>
  <p>C'est rapide, gratuit, fiable et sans inscription.</p>

  <h2 class="fr-mt-8w">
    👥 Exemples de ménages éligibles au bail réel solidaire (brs) :
  </h2>
  <p>
    Paul et Nora, deux jeunes actifs (la somme de leur âge ne dépasse pas 55
    ans) sans enfant vivant à Lyon (zone A), gagnent 60 000 €/an à deux. ✅ Ils
    sont éligibles au Bail Réel Solidaire (BRS).
  </p>
  <p>
    Christine, retraitée, à Montpellier, gagne 1 800€/mois. ✅ Elle est éligible
    au Bail Réel Solidaire (BRS).
  </p>
  <p>
    Anna et Yanis, un couple avec un enfant à charge, vivant dans un logement
    social (HLM) à Marseille (Zone A) gagnent 60 000 €/an à deux. ✅ Ils sont
    éligibles au Bail Réel Solidaire (BRS).
  </p>
  <p>
    Yves est locataire d'un logement social (HLM) à Rennes (Zone A) gagne 30 000
    €/an. ✅ Il est éligible au Bail Réel Solidaire (BRS).
  </p>
  <p>
    Malik et Léa, un couple avec trois enfants à charge, locataires d'un
    logement privé à Vannes (zone B1), gagnent 80 000 €/an à deux. ✅ Ils sont
    éligibles au Bail Réel Solidaire (BRS).
  </p>
  <p>
    👉 Faites le test sur le
    <a
      href="/simulateur-eligibilite"
      class="fr-link">
      simulateur d'éligibilité au bail réel solidaire de BoRiS
    </a>
    !
  </p>
  <p>
    <a
      href="/"
      class="fr-link">
      BoRiS
    </a>
    est la plateforme officielle de l'Etat dédiée au bail réel solidaire.
  </p>
</ArticlePage>
