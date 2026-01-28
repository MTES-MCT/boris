<script lang="ts">
  import type { ArticlePreview } from '$lib/utils/definitions';

  import { steps } from './content';
  import { articles } from '$routes/blog/articles';

  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import ContentPageHero from '$components/common/Heros/ContentPageHero.svelte';
  import CalloutPanel from '$components/common/Panels/CalloutPanel.svelte';
  import KeyPoint from '$components/common/KeyPoint.svelte';
  import Section from '$components/common/Section.svelte';
  import Accordion from '$components/common/Accordion.svelte';
  import VerticalStepper from '$components/common/Steppers/VerticalStepper.svelte';
  import ShadowedBox from '$components/common/ShadowedBox.svelte';
  import Data from '$components/pages/simulateur-eligibilite/Data.svelte';
  import ArticleCard from '$components/pages/blog/ArticleCard.svelte';

  const firstArticle = articles.find(
    (article) =>
      article.slug === '5-idees-recues-sur-le-bail-reel-solidaire-brs',
  ) as ArticlePreview;

  const secondArticle = articles.find(
    (article) =>
      article.slug ===
      'acheter-son-logement-sans-se-ruiner-3-solutions-a-connaitre-absolument',
  ) as ArticlePreview;

  const thirdArticle = articles.find(
    (article) =>
      article.slug === 'un-exemple-pour-vous-projeter-dans-votre-achat-en-brs',
  ) as ArticlePreview;
</script>

<svelte:head>
  <title>Tout savoir sur le bail réel solidaire - BRS - BoRiS</title>
  <meta
    name="description"
    content="Toutes les informations nécessaires sur le dispositif de Bail Réel Solidaire (BRS). BoRiS est la plateforme de référence du Ministère du Logement." />
</svelte:head>

<GradientBackgroundWrapper>
  <ContentPageHero
    title="Le bail réel solidaire, qu'est ce que c'est, comment ça marche ?">
    <p>
      Le bail réel solidaire (BRS) est un dispositif mis en place par l'État
      permettant à des ménages qui ne pourraient pas devenir propriétaires d'un
      logement au prix du marché <b>
        d'accéder à la propriété de leur résidence principale.
      </b>
    </p>
    <a
      href="/simulateur-eligibilite"
      class="fr-btn fr-btn--lg fr-mt-2w">
      Testez votre éligibilité au bail réel solidaire
    </a>
  </ContentPageHero>

  <CalloutPanel
    title="Le bail réel solidaire (BRS) en 3 points clés."
    mascotte="MascotteWaving">
    <div class="fr-col-12 fr-col-lg-4 flex lg:flex-col gap-4">
      <KeyPoint>
        <p>
          <b>
            Les logements mis en vente en bail réel solidaire (BRS) sont 30 à
            50% moins chers que ceux mis en vente dans le marché traditionnel.
          </b>
        </p>
        <p>
          Les prix sont encadrés et contrôlés par l'État. Cela est rendu
          possible notamment parce que les propriétaires d'un logement en bail
          réel solidaire (BRS) achètent leur logement à 100%, mais pas le
          terrain sur lequel celui-ci est construit.
        </p>
        <p>
          En échange, les propriétaires d'un logement d'un bail réel solidaire
          (BRS) s'acquittent d'une redevance mensuelle contenue.
        </p>
      </KeyPoint>
    </div>
    <div class="fr-col-12 fr-col-lg-4 flex lg:flex-col gap-4">
      <KeyPoint>
        <p>
          <b>
            En tant que propriétaire d'un logement en bail réel solidaire (BRS),
            vous pouvez notamment revendre votre logement (avec une plus-value
            toutefois encadrée) ou le transmettre à vos proches.
          </b>
        </p>
        <p>
          Le dispositif se veut ainsi solidaire car il permet aux générations
          futures d'accéder à la propriété dans des conditions similaires, de
          manière abordable.
        </p>
      </KeyPoint>
    </div>
    <div class="fr-col-12 fr-col-lg-4 flex lg:flex-col gap-4">
      <KeyPoint>
        <p>
          Les premiers logements en bail réel solidaire (BRS) ont vu le jour en
          2019. Depuis, le dispositif se déploie sur l'ensemble du territoire
          national.
        </p>
        <p>
          Les acquéreurs sont accompagnés tout au long de leur procédure d'achat
          par un organisme dédié.
        </p>
      </KeyPoint>
    </div>
  </CalloutPanel>

  <VerticalStepper {steps} />

  <div class="fr-mt-8w">
    <Section
      title="Découvrez si des logements en bail réel solidaire (BRS) sont disponibles
          près de chez vous !"
      titleElement="h2"
      narrow>
      <p>
        Les <a
          href="/organismes-de-foncier-solidaire"
          class="fr-link">
          organismes de foncier solidaire (OFS)
        </a>
        partagent la propriété des logements en bail réel solidaire (BRS) avec les
        ménages bénéficiaires du dispositif, les aident, sécurisent leur achat et
        les accompagnent tout au long du processus, découvrez leurs offres !
      </p>
      <a
        href="/logements-brs-disponibles"
        class="fr-btn fr-btn--lg">
        Trouver un logement en bail réel solidaire
      </a>
    </Section>
  </div>

  <div class="fr-container fr-pb-4w fr-mt-8w">
    <div class="rounded-box-md fr-p-4w bg-white">
      <h2>FAQ : Les réponses à vos questions sur le bail réel solidaire</h2>

      <Accordion label="Comment savoir si je suis éligible au BRS ?">
        <p class="fr-mt-1w">
          Pour savoir si vous êtes éligible au bail réel solidaire, il vous
          suffit de remplir ce <a
            href="/simulateur-eligibilite"
            class="fr-link">
            simulateur d'éligibilité au bail réel solidaire
          </a>
          .
        </p>
        <p>
          Pour plus d’informations sur les conditions d’éligibilité, vous pouvez
          consulter cet article dédié: <a
            href="blog/comment-savoir-si-je-suis-eligible-au-bail-reel-solidaire-brs"
            class="fr-link">
            comment savoir si je suis éligible au BRS
          </a>
          .
        </p>
      </Accordion>
      <Accordion label="Le Bail Réel Solidaire (BRS), c’est quoi exactement ?">
        <p class="fr-mt-1w">
          Le bail réel solidaire (BRS) est un dispositif immobilier mis en place
          par l’Etat en 2015. C’est un dispositif d’accession sociale à la
          propriété. Il permet à des personnes qui ne pourraient pas devenir
          propriétaire sur le marché libre, d’acheter leur résidence principale
          30 à 50% moins cher en contrepartie de certaines conditions.
        </p>
        <p>
          Consultez notre article dédié <a
            href="/blog/le-bail-reel-solidaire-brs-cest-quoi-exactement"
            class="fr-link">
            pour tout savoir sur le bail réel solidaire (BRS)
          </a>
          .
        </p>
      </Accordion>
      <Accordion
        label="Quels sont les plafonds de revenus 2026 en bail réel solidaire (BRS) ?">
        <p class="fr-mt-1w">
          Consultez le <a
            href="/simulateur-eligibilite#plafonds-de-ressources"
            class="fr-link">
            tableau des plafonds de revenus brs 2026
          </a>
        </p>
      </Accordion>
      <Accordion label="Comment savoir si je suis en zone A, Abis, B1 ou C ?">
        <p class="fr-mt-1w">
          Pour connaître votre zone, vous pouvez utiliser <a
            href="https://www.service-public.fr/simulateur/calcul/zonage-abc"
            target="_blank"
            rel="noopener noreferrer"
            class="fr-link">
            ce simulateur
          </a>
          .
        </p>
      </Accordion>
      <Accordion label="Quelle est la durée du BRS ?">
        <p class="fr-mt-1w">
          Le Bail Réel Solidaire (BRS) est signé pour une durée de 18 à 99 ans.
          Lorsqu’il y a une revente ou succession, cette durée repart à zéro.
        </p>
      </Accordion>
      <Accordion label="Où trouver un logement en bail réel solidaire ?">
        <p class="fr-mt-1w">
          Pour consulter les différents logements en bail réel solidaire
          disponibles à l’achat, vous pouvez vous rendre sur la page <a
            href="/logements-brs-disponibles"
            class="fr-link">
            trouver un logement en BRS
          </a>
          de BoRiS.
        </p>
        <p>
          Vous y trouverez les appartements et maisons en bail réel solidaire
          proches de chez vous.
        </p>
        <p class="fr-mb-0">
          Voici quelques exemples de communes proposant des biens en bail réel
          solidaire :
        </p>
        <ul>
          <li>Bordeaux</li>
          <li>Lille</li>
          <li>Lyon</li>
          <li>Marseille</li>
          <li>Montpellier</li>
          <li>Nantes</li>
          <li>Nice</li>
          <li>Paris</li>
          <li>Rennes</li>
          <li>Strasbourg</li>
          <li>Toulouse</li>
        </ul>
        <p>Mais ce ne sont pas les seules!</p>
      </Accordion>
      <Accordion label="Un organisme de foncier solidaire (OFS), c'est quoi ?">
        <p class="fr-mt-1w">
          Un <a
            href="/organismes-de-foncier-solidaire"
            class="fr-link">
            organisme de foncier solidaire (OFS)
          </a>
          est un organisme agréé par l'Etat, qui achète des terrains pour y construire
          des logements en bail réel solidaire qu'il met ensuite en vente.
        </p>
        <p>
          Les
          <a
            href="/organismes-de-foncier-solidaire"
            class="fr-link">
            organismes de foncier solidaire (OFS)
          </a>
          sont des structures à but non lucratif.
        </p>
      </Accordion>
      <Accordion
        label="Est-ce que je dois respecter un délai pour revendre mon bien en bail réel solidaire ? Ou je peux revendre quand je veux ?">
        <p class="fr-mt-1w">
          La revente en bail réel solidaire est <b>possible à tout moment</b>
          .
        </p>
        <p>Il n’y a pas de délai à respecter après l’achat.</p>
        <p>
          Vous trouverez ici plus d’informations sur la <a
            href="/revendre-mon-bien-en-brs"
            class="fr-link">
            revente en bail réel solidaire
          </a>
          .
        </p>
      </Accordion>
    </div>
  </div>

  <Section>
    <div class="rounded-box-md fr-p-4w bg-white">
      <h2>
        Quelques articles de blog pour bien comprendre le bail réel solidaire
      </h2>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6">
          <ArticleCard
            title={firstArticle?.pageTitle || firstArticle.title}
            description={firstArticle.description}
            slug={firstArticle.slug}
            firstPublishedAt={firstArticle.firstPublishedAt} />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <ArticleCard
            title={secondArticle?.pageTitle || secondArticle.title}
            description={secondArticle.description}
            slug={secondArticle.slug}
            firstPublishedAt={secondArticle.firstPublishedAt} />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <ArticleCard
            title={thirdArticle?.pageTitle || thirdArticle.title}
            description={thirdArticle.description}
            slug={thirdArticle.slug}
            firstPublishedAt={thirdArticle.firstPublishedAt} />
        </div>
      </div>
    </div>
  </Section>

  <Section>
    <ShadowedBox hidePath>
      <h2 id="plafonds-de-ressources">
        Les plafonds de revenus en bail réel solidaire (BRS)
      </h2>
      <p>
        Les plafonds en vigueur depuis janvier 2025 sont définis à partir de
        votre catégorie de ménage et la zone de votre futur bien. Elle
        correspond à la tension immobilière, du plus tendu où les prix sont les
        plus haut, Abis, au moins tendu, C.
      </p>
      <p>
        Le logement acheté en bail réel solidaire doit être utilisé en tant que
        résidence principale.
      </p>
      <p class="fr-mb-0">
        Les revenus fiscaux de référence* du ménage ne doivent pas dépasser les
        plafonds de ressources ci-dessous :
      </p>
      <a
        href="/revenu-fiscal-de-reference.png"
        target="_blank"
        rel="noopener noreferrer"
        class="fr-link fr-text--sm">
        <i>
          *Où se situe le revenus fiscal de référence sur votre avis
          d'imposition
        </i>
      </a>

      <Data />

      <div class="fr-pt-4w">
        <a
          href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000437021/2025-02-12/"
          class="fr-link"
          target="_blank"
          rel="noopener">
          Textes de référence
        </a>
      </div>
    </ShadowedBox>
  </Section>
</GradientBackgroundWrapper>
