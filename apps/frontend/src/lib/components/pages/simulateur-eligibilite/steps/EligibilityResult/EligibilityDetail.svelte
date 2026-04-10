<script lang="ts">
  import { stepsContent } from '$lib/utils/eligibility-simulator';
  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';
  import Alert from '$components/common/Alert.svelte';

  type Props = {
    hideConnectionCta?: boolean;
  };

  const { hideConnectionCta = false }: Props = $props();

  const { highestEligibilityZone, propertySituation, refuseConnection } =
    $derived(eligibilitySimulatorManager);

  let isOwner = $derived(propertySituation === 'PROPRIETAIRE');
</script>

<div
  class="fr-fieldset__element"
  class:fr-mb-4w={!hideConnectionCta}>
  {#if highestEligibilityZone === 'A_AND_ABIS'}
    {@render resultAlert(
      stepsContent.eligibility.zoneAandAbis[isOwner ? 'titleOwner' : 'title'],
      isOwner ? 'info' : 'success',
    )}
    {#if isOwner}
      <p>{@html stepsContent.eligibility.isOwner.content}</p>
    {/if}
    <p>{@html stepsContent.eligibility.zoneAandAbis.content}</p>
    <p>{@html stepsContent.eligibility.zoneInfo.content}</p>
    {@render connectionCta(hideConnectionCta)}
  {:else if highestEligibilityZone === 'B1'}
    {@render resultAlert(
      stepsContent.eligibility.zoneB1[isOwner ? 'titleOwner' : 'title'],
      isOwner ? 'info' : 'success',
    )}
    {#if isOwner}
      <p>{@html stepsContent.eligibility.isOwner.content}</p>
    {/if}
    <p>{@html stepsContent.eligibility.zoneB1.content}</p>
    <p>{@html stepsContent.eligibility.zoneInfo.content}</p>
    {@render connectionCta(hideConnectionCta)}
  {:else if highestEligibilityZone === 'B2_AND_C'}
    {@render resultAlert(
      stepsContent.eligibility.zoneB2andC[isOwner ? 'titleOwner' : 'title'],
      isOwner ? 'info' : 'success',
    )}
    {#if isOwner}
      <p>{@html stepsContent.eligibility.isOwner.content}</p>
    {/if}
    <p>{@html stepsContent.eligibility.zoneB2andC.content}</p>
    {@render connectionCta(hideConnectionCta)}
  {:else}
    {@render resultAlert(stepsContent.eligibility.notEligible.title, 'error')}
    <p>{@html stepsContent.eligibility.notEligible.content}</p>
  {/if}
</div>

{#snippet resultAlert(
  content: string,
  type: 'success' | 'info' | 'error' = 'success',
)}
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
