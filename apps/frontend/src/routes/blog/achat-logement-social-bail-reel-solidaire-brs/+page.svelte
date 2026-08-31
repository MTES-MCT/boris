<script lang="ts">
  import ArticlePage from '$components/pages/blog/ArticlePage.svelte';
  import type { ArticlePreview } from '$lib/utils/definitions';
  import { articles } from '$routes/blog/articles';

  const article = articles.find(
    (article) =>
      article.slug === 'achat-logement-social-bail-reel-solidaire-brs',
  ) as ArticlePreview;
</script>

<ArticlePage {article}>
  <p>
    Vous souhaitez réaliser <b>l'achat d'un logement social</b>
    et devenir propriétaire à moindre coût ? Découvrez une alternative à la vente
    HLM : le Bail Réel Solidaire (BRS) et achetez votre résidence principale entre
    30 % et 50 % moins cher que le prix du marché.
  </p>
  <p>
    Ce dispositif s'adresse aux ménages souhaitant acheter un logement social,
    en alternative à la vente HLM ou à la location-accession (PSLA).
  </p>

  <h2 class="fr-mt-8w">
    Achat d'un logement social : le Bail Réel Solidaire pour devenir
    propriétaire
  </h2>
  <p>
    Le <b>Bail Réel Solidaire (BRS)</b>
    est un dispositif d'accession sociale à la propriété qui permet à des ménages
    aux revenus modestes et intermédiaires de réaliser l'achat d'un logement social
    à un prix inférieur au marché classique.
  </p>
  <p>
    Contrairement à la vente de logements sociaux (HLM), le BRS ne consiste pas
    à acheter un logement social existant, mais à devenir propriétaire d'un
    logement neuf ou récent, construit spécifiquement dans un cadre défini par
    la loi et la réglementation, en partenariat avec un
    <a
      href="/organismes-de-foncier-solidaire"
      class="fr-link">
      Organisme de Foncier Solidaire (OFS)
    </a>
    . Le BRS est donc bien un dispositif de logement social (décompté comme tel par
    les collectivités territoriales et l'État), mais orienté vers l'accession à la
    propriété.
  </p>

  <h2 class="fr-mt-8w">
    Les avantages du BRS : dispositif d'achat de logement social
  </h2>
  <h3>1. Accéder à la propriété à moindre coût</h3>
  <p>
    Le bail réel solidaire permet de réduire significativement le prix au moment
    de l'achat. L'acheteur peut ainsi acheter son logement entre 30 % et 50 %
    moins cher que le prix du marché. Cette économie rend l'achat d'un logement
    social accessible à des ménages qui ne pourraient pas devenir propriétaires
    dans un cadre classique. En échange, ces ménages s'engagent à verser une
    redevance mensuelle contenue à leur OFS et à utiliser ce logement comme leur
    résidence principale.
  </p>
  <p>
    Le montant à emprunter pour les logements en BRS étant plus faible, les
    conditions d'accès au crédit immobilier sont souvent plus favorables.
    L'apport demandé pour l'achat d'un logement social en bail réel solidaire
    est notamment plus faible que pour un achat sur le marché libre. Cela
    facilite l'accession à la propriété pour les ménages disposant d'une épargne
    limitée.
  </p>

  <h3>2. Stabilité résidentielle et liberté d'aménagement</h3>
  <p>
    Une fois propriétaire grâce au Bail Réel Solidaire, vous bénéficiez d'une
    stabilité durable dans un logement que vous pouvez aménager selon vos
    besoins, dans le respect des règles de copropriété et du cadre défini avec
    l'Organisme de Foncier Solidaire. L'Organisme de Foncier Solidaire, qui
    partage ainsi la propriété avec vous, est garant du bon fonctionnement de la
    copropriété et peut vous accompagner dans un projet de revente de votre
    logement.
  </p>
  <p>
    Le BRS combine ainsi les avantages de la propriété et ceux d'un dispositif
    de logement social sécurisé.
  </p>

  <h2 class="fr-mt-8w">Les critères pour bénéficier du bail réel solidaire</h2>
  <p>
    Le Bail Réel Solidaire s'adresse principalement aux primo-accédants,
    c'est-à-dire aux personnes qui n'ont pas été propriétaires de leur résidence
    principale au cours des deux dernières années.
  </p>
  <p>
    Toutefois, certains profils déjà propriétaires peuvent
    <a
      href="/blog/puis-je-acheter-un-logement-en-brs-si-je-suis-deja-proprietaire"
      class="fr-link">
      acheter un logement social en BRS sous conditions spécifiques
    </a>
    .
  </p>
  <p>
    En complément, pour les logements en BRS, il est nécessaire de respecter des
    plafonds de ressources, qui varient selon la zone géographique et la
    composition du ménage. Ces conditions de ressources sont vérifiées au moment
    de la demande de logement.
  </p>

  <h2 class="fr-mt-8w">
    Quelles sont les étapes pour un achat d'un logement social en BRS ?
  </h2>
  <p>
    Voici les 3 étapes à suivre lors de l'achat d'un logement social en BRS
    (achat hors du cadre de la vente HLM) :
  </p>
  <ol>
    <li>Vérifier son éligibilité et s'informer sur le dispositif</li>
    <li>Estimer son budget mensuel</li>
    <li>Trouver un logement en BRS</li>
  </ol>
  <p>
    Vous les retrouverez détaillées dans le tableau ci-dessous, accompagnées des
    liens utiles pour chacune de ces étapes.
  </p>

  <div class="fr-table fr-table--bordered">
    <table>
      <caption>Les étapes d'un achat de logement social en BRS</caption>
      <thead>
        <tr>
          <th scope="col">Étapes</th>
          <th scope="col">Informations</th>
          <th scope="col">Liens utiles</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">
            <h3>
              Étape 1 : Vérifier son éligibilité et s'informer sur le dispositif
            </h3>
          </th>
          <td>
            Vous pouvez vérifier votre éligibilité grâce au simulateur en ligne
            BoRiS. Il vous suffit de renseigner quelques informations sur vos
            revenus et votre situation pour savoir si vous pouvez acheter un
            logement social en BRS.
          </td>
          <td>
            <ul>
              <li>
                <a
                  href="/simulateur-eligibilite"
                  class="fr-link">
                  Tester mon éligibilité au bail réel solidaire
                </a>
              </li>
              <li>
                <a
                  href="/tout-savoir-sur-le-bail-reel-solidaire-brs"
                  class="fr-link">
                  Tout savoir sur le BRS
                </a>
              </li>
              <li>
                <a
                  href="/blog/les-inconvenients-ou-contreparties-du-bail-reel-solidaire-brs"
                  class="fr-link">
                  Quelles sont les contreparties du dispositif ?
                </a>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <h3>Étape 2 : Estimer son budget mensuel</h3>
          </th>
          <td>
            Avant de vous lancer dans l'achat d'un logement social, il est
            essentiel d'estimer le coût mensuel (remboursement du crédit +
            redevance foncière). Renseignez-vous également sur les aides et
            conseils en financement disponibles, tels que le conseil en
            financement d'Action Logement, le prêt à taux zéro, etc.
          </td>
          <td>
            <ul>
              <li>
                <a
                  href="/simulateur-acquisition"
                  class="fr-link">
                  Estimer mon budget pour un achat en BRS
                </a>
              </li>
              <li>
                <a
                  href="/tout-savoir-sur-le-bail-reel-solidaire-brs/je-cherche-des-financements"
                  class="fr-link">
                  Connaître les emprunts et aides disponibles
                </a>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <h3>Étape 3 : Trouver un logement en BRS</h3>
          </th>
          <td>
            De plus en plus de programmes immobiliers proposent des logements en
            bail réel solidaire. Vous pouvez consulter la carte des projets
            gérés par les Organismes de Foncier Solidaire pour repérer un bien
            disponible près de chez vous.
          </td>
          <td>
            <a
              href="/logements-brs-disponibles"
              class="fr-link">
              Visiter notre cartographie des villes qui proposent des logements
              en BRS à la vente
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</ArticlePage>
