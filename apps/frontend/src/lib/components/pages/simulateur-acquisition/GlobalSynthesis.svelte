<script lang="ts">
  import { default as Logo } from '$assets/illustrations/logo.svg?raw';

  import OperationSynthesis from './OperationSynthesis.svelte';
  import FeesSynthesis from './FeesSynthesis.svelte';
  import LissageSynthesis from './LissageSynthesis.svelte';

  import blocMarque from '$assets/images/bloc-marque.jpg';
</script>

<div class="pdf-only">
  <div class="flex justify-center fr-mt-10w">
    <img
      src={blocMarque}
      alt=""
      width="150"
      height="117" />

    <div class="logo-container">
      {@html Logo}
    </div>
  </div>

  <p class="fr-text--lg fr-text--bold fr-mt-6w fr-mb-0">
    Date : {new Date().toLocaleDateString()}
  </p>

  <h2 class="fr-mb-6w">Récapitulatif de la simulation</h2>

  <ul>
    <li>
      1. <span class="fr-text--bold">Synthèse de l'apport et des frais</span>
    </li>
    <li>
      2. <span class="fr-text--bold">Lissage des prêts</span>
    </li>
    <li>
      3. <span class="fr-text--bold">
        Synthèse de la redevance BRS et des charges
      </span>
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
    height: 117px;
    width: 117px;

    :global(svg) {
      width: 100%;
      height: 100%;
    }
  }
</style>
