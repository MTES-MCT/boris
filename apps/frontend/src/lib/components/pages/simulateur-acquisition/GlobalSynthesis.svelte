<script lang="ts">
  import { default as Logo } from '$assets/illustrations/logo.svg?raw';

  import OperationSynthesis from './OperationSynthesis.svelte';
  import FeesSynthesis from './FeesSynthesis.svelte';
  import LissageSynthesis from './LissageSynthesis.svelte';

  import blocMarque from '$assets/images/bloc-marque.jpg';
</script>

<div class="pdf-only">
  <div class="flex fr-mt-10w">
    <img
      src={blocMarque}
      alt=""
      width="100"
      height="78" />

    <div class="logo-container">
      {@html Logo}
    </div>
  </div>

  <p class="fr-text--lg fr-text--bold fr-mt-6w fr-mb-0">
    Date : {new Date().toLocaleDateString()}
  </p>

  <h2 class="fr-mb-6w">Récapitulatif de la simulation</h2>

  <p class="fr-text--sm">
    Ce document synthétise la simulation de votre projet d'acquisition en bail
    réel solidaire (BRS). Les montants et calculs présentés ci-dessous sont des
    estimations basées sur les informations que vous avez renseignées et ne
    constituent pas une offre ferme de financement. Cette simulation est fournie
    à titre informatif uniquement. Les conditions réelles de financement peuvent
    différer selon votre situation personnelle et les critères d'octroi des
    organismes prêteurs.
  </p>

  <ul class="fr-text--sm">
    <li>
      1. <span class="fr-text--bold">Synthèse de l'apport et des frais</span>
      <p>
        Cette section présente le montant de l'apport personnel, les frais de
        notaire et les autres frais ponctuels à prévoir.
      </p>
    </li>
    <li>
      2. <span class="fr-text--bold">Lissage des prêts</span>
      <p>
        Le lissage permet de répartir vos remboursements sur plusieurs phases,
        en adaptant les mensualités selon votre situation financière. Cette
        simulation vous montre comment vos prêts seront structurés dans le
        temps.
      </p>
    </li>
    <li>
      3. <span class="fr-text--bold">
        Synthèse de la redevance BRS et des charges
      </span>
      <p>
        Il s'agit d'une estimation claire du coût mensuel et annuel à prévoir
        une fois propriétaire. Il est important de planifier votre budget en
        anticipant bien tous les frais liés à la propriété.
      </p>
    </li>
  </ul>
</div>

<h2 class="fr-mb-6w not-printable">Récapitulatif de la simulation</h2>

<div class="page-break-before">
  <p class="fr-h5">Synthèse de l'apport et des frais</p>
  <OperationSynthesis />
</div>

<div class="separator fr-my-6w not-printable"></div>

<div class="page-break-before">
  <p class="fr-h5">Lissage des prêts</p>
  <LissageSynthesis />
</div>

<div class="separator fr-my-6w not-printable"></div>

<div class="page-break-before">
  <p class="fr-h5">Synthèse de la redevance BRS et des charges</p>
  <FeesSynthesis />
</div>

<style lang="postcss">
  .logo-container {
    height: 78px;
    width: 78px;

    :global(svg) {
      width: 100%;
      height: 100%;
    }
  }
</style>
