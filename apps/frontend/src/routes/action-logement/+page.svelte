<script lang="ts">
  import Section from '$components/common/Section.svelte';
</script>

<svelte:head>
  <title>Action Logement | Boris</title>
  <meta
    name="description"
    content="Service de conseil gratuit d'Action Logement pour vous accompagner dans votre projet d'achat en BRS et construire un plan de financement adapté." />
</svelte:head>

<Section
  title="Service de conseil en financement et en accession d’Action Logement"
  titleElement="h1">
  <p>
    <b>
      Vous souhaitez devenir propriétaire grâce au Bail Réel Solidaire (BRS) ?
    </b>
    Action Logement met à votre disposition un service de conseil gratuit et personnalisé
    pour vous accompagner dans votre projet. Nos conseillers vous aident à évaluer
    la faisabilité de votre achat en BRS et à construire un plan de financement adapté
    à votre situation.
  </p>

  <video
    src="https://github.com/MTES-MCT/boris/releases/download/v1.0/action-logement.mp4"
    controls
    class="fr-mt-2w"
    width="100%">
    <track kind="captions" />
    Votre navigateur ne supporte pas la vidéo.
  </video>

  <h2 class="fr-mt-6w">À qui s’adresse ce service ?</h2>
  <p>
    Ce service est destiné aux <b>salariés d’entreprises du secteur privé</b>
    , y compris du secteur agricole, sous certaines conditions :
  </p>
  <ul>
    <li>
      Vous travaillez dans une entreprise de <b>10 salariés ou plus</b>
      (ou 50 et plus pour le secteur agricole)
    </li>
    <li>
      Vous êtes en contrat de travail (CDI, CDD, alternance…) ou récemment
      embauché(e)
    </li>
  </ul>
  <p>
    Le service de conseil en financement d’Action logement peut également vous
    accompagner pour d’autres projets qu’un achat en BRS, <a
      href="https://www.actionlogement.fr/le-conseil-en-accession"
      class="fr-link"
      target="_blank"
      rel="noopener">
      en savoir plus
    </a>
    .
  </p>
  <p>
    <b>Bon à savoir</b>
    : Action Logement peut également vous proposer des
    <b>prêts à taux</b>
    avantageux (dont le prêt accession ou prêt agri-accession selon votre situation)
    pour faciliter votre achat ou construction.
  </p>

  <h2 class="fr-mt-6w">Pourquoi choisir l’accompagnement d’Action Logement</h2>
  <ol>
    <li>Service gratuit et sur mesure</li>
    <li>
      Plan de financement global, intégrant les aides Action Logement et
      conforme aux normes bancaires
    </li>
    <li>Réseau de conseillers spécialisés présent sur tout le territoire</li>
    <li>
      Analyse confidentielle de votre situation, pour sécuriser votre projet
    </li>
    <li>Transparence et objectivité, gages de sérieux et de fiabilité</li>
  </ol>

  <a
    class="fr-btn fr-btn--lg fr-my-2w"
    href="https://www.actionlogement.fr/demande-cfi?ept-publisher=boris&ept-name=boris-partenariat&eseg-name=site&eseg-item=page-cfa"
    target="_blank"
    rel="noopener">
    Solliciter le service de conseil en financement et en accession
  </a>

  <p class="fr-text--sm">
    <i>
      Un crédit engage et doit être remboursé, pensez à bien évaluer votre
      capacité avant de vous lancer.
    </i>
  </p>
</Section>
