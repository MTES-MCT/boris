<script lang="ts">
  import Badge from '$components/common/Badge.svelte';
  import Notice from '$components/common/Notice.svelte';
  import acquisitionSimulatorManager from '$lib/managers/acquisition-simulator.svelte';
  import { formatEuro } from '$lib/utils/formatters';
  import type { PhaseRemboursement } from '$lib/utils/lissage-ptz';
  import Element from '$components/pages/simulateur-acquisition/Synthesis/Element.svelte';
  import RowContainer from '$components/pages/simulateur-acquisition/Synthesis/RowContainer.svelte';
  import Row from '$components/pages/simulateur-acquisition/Synthesis/Row.svelte';
  import {
    formatLoanPhaseDuration,
    formatLoanPhaseNumber,
  } from '$lib/utils/helpers';
  import Highlight from '$components/common/Highlight.svelte';
  let { pretLisse } = $derived(acquisitionSimulatorManager);

  const lissage = $derived(pretLisse?.lisser() as PhaseRemboursement[]);
</script>

{#if !pretLisse?.estElligible}
  <Element>
    <p class="fr-h6 fr-mb-1w">Remboursement du prêt immobilier</p>
    <p class="fr-text--sm">
      <Badge
        status="new"
        hideIcon>
        {formatLoanPhaseDuration(lissage[0].dureeAnnees, 0)}
      </Badge>
    </p>
    <div class="separator"></div>
    <RowContainer>
      <Row
        title="Mensualité globale"
        value={formatEuro(Number(lissage[0].mensualiteClassique), 2)}
        status="success"
        operator="="
        tooltip="Hors assurance emprunteur." />
    </RowContainer>
  </Element>

  <Highlight
    text="D'après les informations que vous nous avez fournies, vous n'êtes pas éligible au PTZ."
    accent="pink-tuile"
    icon="warning-fill"
    size="sm"
    fontWeight="bold" />
{:else}
  {#each lissage as phase, index}
    <Element isLast={index === lissage.length - 1}>
      <p class="fr-mb-0 fr-text--lg fr-text--bold">
        {formatLoanPhaseNumber(index + 1)}
      </p>
      <div class="fr-mb-4w">
        <Badge
          status="new"
          hideIcon>
          {formatLoanPhaseDuration(phase.dureeAnnees, phase.anneesDifferees)}
        </Badge>
      </div>

      <RowContainer>
        <Row
          title="Mensualité PTZ"
          value={formatEuro(Number(phase.mensualitePTZ), 2)}
          status={phase.mensualitePTZ === '0.00' ? 'default' : 'info'} />
        <Row
          title="Mensualité principale"
          value={formatEuro(Number(phase.mensualiteClassique), 2)}
          status={phase.mensualiteClassique === '0.00' ? 'default' : 'info'}
          operator="+"
          tooltip="Hors assurance emprunteur." />
        <div class="separator"></div>
        <Row
          title="Mensualité globale"
          value={formatEuro(
            Number(phase.mensualitePTZ) + Number(phase.mensualiteClassique),
            2,
          )}
          operator="="
          status="success" />
      </RowContainer>
    </Element>
  {/each}
{/if}
