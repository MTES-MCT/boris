<script lang="ts">
  import OperationSynthesis from './OperationSynthesis.svelte';
  import FeesSynthesis from './FeesSynthesis.svelte';
  import LissageSynthesis from './LissageSynthesis.svelte';
</script>

<h2 class="fr-mb-6w">Récapitulatif de la simulation</h2>

<p class="fr-h5">Synthèse de l'apport et des frais</p>
<OperationSynthesis />

<div class="separator fr-my-6w"></div>

<p class="fr-h5">Lissage des prêts</p>
<LissageSynthesis />

<div class="separator fr-my-6w"></div>
<p class="fr-h5">Synthèse de la redevance BRS et des charges</p>
<FeesSynthesis />
