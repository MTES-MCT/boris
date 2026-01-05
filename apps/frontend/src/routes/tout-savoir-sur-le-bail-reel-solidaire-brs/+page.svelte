<script lang="ts">
  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Hero from '$components/common/StepPage/Hero.svelte';
  import Promesses from '$components/common/StepPage/Promesses.svelte';
  import Promess from '$components/common/StepPage/Promess.svelte';
  import Steps from '$components/common/StepPage/Steps.svelte';
  import Step from '$components/common/StepPage/Step.svelte';
  import Section from '$components/common/Section.svelte';
  import Accordion from '$components/common/Accordion.svelte';
  import Table from '$components/common/Table.svelte';

  import { default as BrsEtape1 } from '$assets/illustrations/brs-etape-1.svg?raw';
  import { default as BrsEtape2 } from '$assets/illustrations/brs-etape-2.svg?raw';
  import { default as BrsEtape3 } from '$assets/illustrations/brs-etape-3.svg?raw';
  import { default as BrsEtape4 } from '$assets/illustrations/brs-etape-4.svg?raw';
  import { default as BrsEtape5 } from '$assets/illustrations/brs-etape-5.svg?raw';
  import { steps } from './[slug]/content';
  import { eligibilityDataTable } from '$lib/utils/constants';
</script>

<svelte:head>
  <title>Tout savoir sur le bail réel solidaire - BRS - BoRiS</title>
  <meta
    name="description"
    content="Toutes les informations nécessaires sur le dispositif de Bail Réel Solidaire (BRS). BoRiS est la plateforme de référence du Ministère du Logement." />
</svelte:head>

<GradientBackgroundWrapper>
  <Hero
    title="Le bail réel solidaire, qu’est ce que c’est, comment ça marche ?">
    <p>
      Le bail réel solidaire (BRS) est un dispositif mis en place par l’État
      permettant à des ménages qui ne pourraient pas devenir propriétaires d'un
      logement au prix du marché <b>
        d’accéder à la propriété de leur résidence principale.
      </b>
    </p>
    <a
      href="/simulateur-eligibilite"
      class="fr-btn fr-btn--lg fr-mt-2w">
      Testez votre éligibilité au bail réel solidaire
    </a>
  </Hero>

  <Promesses title="Le bail réel solidaire (BRS) en 3 points clés.">
    <Promess>
      <p>
        <b>
          Les logements mis en vente en bail réel solidaire (BRS) sont 30 à 50%
          moins chers que ceux mis en vente dans le marché traditionnel.
        </b>
      </p>
      <p>
        Les prix sont encadrés et contrôlés par l'État. Cela est rendu possible
        notamment parce que les propriétaires d'un logement en bail réel
        solidaire (BRS) achètent leur logement à 100%, mais pas le terrain sur
        lequel celui-ci est construit.
      </p>
      <p>
        En échange, les propriétaires d'un logement d'un bail réel solidaire
        (BRS) s'acquittent d'une redevance mensuelle contenue.
      </p>
    </Promess>
    <Promess>
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
    </Promess>
    <Promess>
      <p>
        Les premiers logements en bail réel solidaire (BRS) ont vu le jour en
        2019. Depuis, le dispositif se déploie sur l’ensemble du territoire
        national.
      </p>
      <p>
        Les acquéreurs sont accompagnés tout au long de leur procédure d'achat
        par un organisme dédié.
      </p>
    </Promess>
  </Promesses>

  <Steps>
    <Step
      title="Je me renseigne sur le dispositif du bail réel solidaire (BRS)."
      illustration={BrsEtape1}
      linkLabel="Tout savoir sur le bail réel solidaire"
      href={`/tout-savoir-sur-le-bail-reel-solidaire-brs/${steps[0].slug}`}
      position={1}>
      <p>
        Découvrez les informations relatives au bail réel solidaire : les
        avantages du bail réel solidaire (BRS), les inconvénients du bail réel
        solidaire (où plutôt les contreparties), les critères d’éligibilité et
        les parties prenantes d’un projet en BRS.
      </p>
      <p>
        Quels sont les avantages et les inconvénients du bail réel solidaire ?
      </p>
    </Step>

    <Step
      title="Je trouve mon logement en bail réel solidaire (BRS)."
      illustration={BrsEtape2}
      linkLabel="Construire son projet immobilier"
      href={`/tout-savoir-sur-le-bail-reel-solidaire-brs/${steps[1].slug}`}
      position={2}>
      <p>
        Définissez votre projet d’achat, trouvez le logement de vos rêves en
        BRS, construisez votre dossier et candidatez pour l'obtenir.
      </p>
    </Step>

    <Step
      title="Je cherche des financements."
      illustration={BrsEtape3}
      linkLabel="Définir son projet financier"
      href={`/tout-savoir-sur-le-bail-reel-solidaire-brs/${steps[2].slug}`}
      position={3}>
      <p>
        Assurez-vous de pouvoir financer votre achat, payer les frais en tant
        que propriétaire en BRS grâce à vos fonds propres, un emprunt bancaire
        et des aides éventuelles et projetez-vous à plus long terme.
      </p>
    </Step>

    <Step
      title="Je passe chez le notaire."
      illustration={BrsEtape4}
      linkLabel="S'assurer du bon déroulement de l'achat"
      href={`/tout-savoir-sur-le-bail-reel-solidaire-brs/${steps[3].slug}`}
      position={4}>
      <p>
        Vérifiez toutes les étapes après avoir trouvé un logement, les documents
        à fournir ainsi que comment choisir son ou sa notaire pour signer l'acte
        de vente.
      </p>
    </Step>

    <Step
      title="Je suis chez moi !"
      illustration={BrsEtape5}
      linkLabel="Découvrez les spécificités pour l’après achat"
      href={`/tout-savoir-sur-le-bail-reel-solidaire-brs/${steps[4].slug}`}
      position={5}
      isLast>
      <p>
        Profitez de votre logement et assurez-vous de bien connaître les
        spécificités liées au BRS : l’assurance logement BRS, réalisation des
        travaux, la vie en copropriété et la revente du logement.
      </p>
    </Step>
  </Steps>

  <div class="fr-mt-8w">
    <Section
      title="Découvrez si des logements en bail réel solidaire (BRS) sont disponibles
          près de chez vous !"
      titleElement="h2"
      narrow>
      <p>
        Les OFS partagent la propriété des logements en bail réel solidaire
        (BRS) avec les ménages bénéficiaires du dispositif, les aident,
        sécurisent leur achat et les accompagnent tout au long du processus,
        découvrez leurs offres !
      </p>
      <a
        href="/logements-brs-disponibles"
        class="fr-btn fr-btn--lg">
        Trouver un logement en bail réel solidaire
      </a>
    </Section>
  </div>

  <div class="fr-container fr-pb-4w fr-mt-8w">
    <div class="rounded-box-md background-color-white fr-p-4w">
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
      <Accordion label="Un Organisme de Foncier Solidaire (OFS), c’est quoi ?">
        <p class="fr-mt-1w">
          Un Organisme de Foncier Solidaire est un organisme agréé par l’Etat,
          qui achète des terrains pour y construire des logements en bail réel
          solidaire qu’il met ensuite en vente.
        </p>
        <p>
          Les Organismes de Foncier Solidaire (OFS) sont des structures à but
          non lucratif.
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

  <Section
    title="Quelques articles de blog pour bien comprendre le bail réel solidaire"
    titleElement="h2">
    <ul>
      <li>
        <a
          href="/blog/5-idees-recues-sur-le-bail-reel-solidaire-brs"
          class="fr-link">
          5 idées reçues sur le bail réel solidaire (BRS)
        </a>
      </li>
      <li>
        <a
          href="/blog/acheter-son-logement-sans-se-ruiner-3-solutions-a-connaitre-absolument"
          class="fr-link">
          Acheter son logement sans se ruiner : 3 solutions à connaître
          absolument
        </a>
      </li>
      <li>
        <a
          href="/blog/un-exemple-pour-vous-projeter-dans-votre-achat-en-brs"
          class="fr-link">
          Un exemple pour vous projeter dans votre achat en BRS
        </a>
      </li>
    </ul>
  </Section>

  <Section
    title="Les plafonds de revenus en bail réel solidaire (BRS)"
    titleElement="h2">
    <p>
      Les plafonds en vigueur depuis janvier 2025 sont définis à partir de votre
      catégorie de ménage et la zone de votre futur bien. Elle correspond à la
      tension immobilière, du plus tendu où les prix sont les plus haut, Abis,
      au moins tendu, C.
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
      href="https://drive.google.com/file/d/1mJBo1cj9-idRRmewzR3-cKn87JZ76-A7/view?usp=sharing"
      target="_blank"
      rel="noopener noreferrer"
      class="fr-link fr-text--sm">
      <i>
        *Où se situe le revenus fiscal de référence sur votre avis d’imposition
      </i>
    </a>

    <Table
      theads={eligibilityDataTable.theads}
      tbodies={eligibilityDataTable.tbodies} />
    <a
      href="https://www.service-public.fr/simulateur/calcul/zonage-abc"
      target="_blank"
      rel="noopener noreferrer"
      class="fr-link fr-text--sm">
      <i>Pour connaître votre zone</i>
    </a>
  </Section>
</GradientBackgroundWrapper>
