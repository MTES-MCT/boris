<script lang="ts">
  import { stepsContent } from '$lib/utils/eligibility-simulator';
  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';
  import Alert from '$components/common/Alert.svelte';

  type Props = {
    hideConnectionCta?: boolean;
  };

  const { hideConnectionCta = false }: Props = $props();

  const { eligibility, propertySituation, refuseConnection } = $derived(
    eligibilitySimulatorManager,
  );
</script>

<div
  class="fr-fieldset__element"
  class:fr-mb-4w={!hideConnectionCta}>
  {#if propertySituation === 'PROPRIETAIRE'}
    {@render resultAlert(stepsContent.eligibility.isOwner.title, 'error')}
    <p>{stepsContent.eligibility.isOwner.content}</p>
    {@render connectionCta(hideConnectionCta)}
  {:else if eligibility?.eligibleZoneB2andC}
    {@render resultAlert(stepsContent.eligibility.zoneB2andC.title)}
    <p>{stepsContent.eligibility.zoneB2andC.content}</p>
    {@render connectionCta(hideConnectionCta)}
  {:else if eligibility?.eligibleZoneB1}
    {@render resultAlert(stepsContent.eligibility.zoneB1.title)}
    <p>{stepsContent.eligibility.zoneB1.content}</p>
    {@render connectionCta(hideConnectionCta)}
  {:else if eligibility?.eligibleZoneAandAbis}
    {@render resultAlert(stepsContent.eligibility.zoneAandAbis.title)}
    <p>{stepsContent.eligibility.zoneAandAbis.content}</p>
    {@render connectionCta(hideConnectionCta)}
  {:else}
    {@render resultAlert(stepsContent.eligibility.notEligible.title, 'error')}
    <p>{stepsContent.eligibility.notEligible.content}</p>
  {/if}
</div>

{#snippet resultAlert(content: string, type: 'success' | 'error' = 'success')}
  <div class="!mb-4">
    <Alert {type}>
      <p
        class="fr-text--bold"
        data-testid="eligibility-result-text">
        {@html content}
      </p>
    </Alert>
  </div>
{/snippet}

{#snippet connectionCta(hidden: boolean)}
  {#if !hidden}
    <div class="fr-fieldset__element">
      <div class="separator !mb-8"></div>
      <h4 class="fr-h5">{stepsContent.connection.title}</h4>
      <p>
        {stepsContent.connection.connectionCtaText}
      </p>
      <p class="!mb-0">
        {stepsContent.exitSimulatorText}
        <button
          type="button"
          class="fr-link !inline underline"
          data-testid="refuse-connection-link"
          onclick={refuseConnection}>
          ici
        </button>
        .
      </p>
    </div>
  {/if}
{/snippet}
