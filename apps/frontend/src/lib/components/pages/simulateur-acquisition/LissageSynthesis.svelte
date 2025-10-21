<script lang="ts">
  import { formatEuro } from '$lib/utils/formatters';
  import {
    formatLoanPhaseDuration,
    formatLoanPhaseNumber,
  } from '$lib/utils/helpers';

  import Badge from '$components/common/Badge.svelte';
  import Block from '$components/pages/simulateur-acquisition/synthesis/Block.svelte';
  import RowContainer from '$components/pages/simulateur-acquisition/synthesis/RowContainer.svelte';
  import Row from '$components/pages/simulateur-acquisition/synthesis/Row.svelte';
  import Highlight from '$components/common/Highlight.svelte';

  import acquisitionSimulatorManager from '$lib/managers/acquisition-simulator.svelte';

  let { pretLisse } = $derived(acquisitionSimulatorManager);
</script>

{#if !pretLisse?.estElligible}
  <Block>
    <p class="fr-h6 fr-mb-1w">Montants de l'opérations</p>
    <RowContainer>
      <Row
        title="Prêt principal"
        value={formatEuro(pretLisse?.montantPretClassique || 0)}
        status="info" />
      <Row
        title="Intérêts prêt principal"
        value={formatEuro(pretLisse?.calculateInterestCost() || 0)}
        status="warning" />
    </RowContainer>
  </Block>
  <Block>
    <p class="fr-h6 fr-mb-1w">Remboursement du prêt immobilier</p>
    <p class="fr-text--sm">
      <Badge
        hideIcon
        uppercase={false}>
        <span class="fr-icon fr-icon-calendar-line fr-icon--sm"></span>
        <span class="fr-pl-1v fr-text--xs">
          {`Durée totale: ${pretLisse?.phasesRemboursement[0].dureeAnnees} ans`}
        </span>
      </Badge>
    </p>
    <div class="separator"></div>
    <RowContainer>
      <Row
        title="Mensualité globale"
        value={`${formatEuro(Number(pretLisse?.phasesRemboursement[0].mensualiteClassique), 2)}`}
        status="new"
        tooltip="Hors assurance emprunteur." />
    </RowContainer>
  </Block>

  <div class="not-printable">
    <Highlight
      text="D'après les informations que vous nous avez fournies, vous n'êtes pas éligible au PTZ."
      accent="pink-tuile"
      icon="warning-fill"
      size="sm"
      fontWeight="bold"
      href="https://www.anil.org/pret-taux-zero/" />
  </div>
{:else}
  <div class="fr-mb-2w">
    <Block>
      <p class="fr-h6 fr-mb-1w">Montants de l'opérations</p>
      <div class="not-printable fr-mb-1w">
        <Badge
          status="success"
          uppercase={false}>
          <span class="fr-text--xs">
            Vous êtes éligible au prêt à taux zéro (PTZ)
          </span>
        </Badge>
      </div>
      <RowContainer>
        <Row
          title="Prêt à taux zéro"
          value={formatEuro(pretLisse?.montantPTZ || 0)}
          status="info" />
        <Row
          title="Prêt principal"
          value={formatEuro(pretLisse?.montantPretClassique || 0)}
          status="info" />
        <Row
          title="Intérêts prêt principal"
          value={formatEuro(pretLisse?.calculateInterestCost() || 0)}
          status="warning" />
      </RowContainer>
    </Block>
  </div>
  {#each pretLisse?.phasesRemboursement as phase, index}
    <Block isLast={index === pretLisse?.phasesRemboursement.length - 1}>
      <p class="fr-mb-0 fr-text--lg fr-text--bold">
        {formatLoanPhaseNumber(index + 1)}
      </p>
      <div class="fr-mb-4w not-printable">
        <Badge
          hideIcon
          uppercase={false}>
          <span class="fr-icon fr-icon-calendar-line fr-icon--sm"></span>
          <span class="fr-pl-1v fr-text--xs">
            {formatLoanPhaseDuration(phase.dureeAnnees, phase.anneesDifferees)}
          </span>
        </Badge>
      </div>
      <div class="pdf-only">
        <p class="fr-text--xs fr-text--bold">
          {formatLoanPhaseDuration(phase.dureeAnnees, phase.anneesDifferees)}
        </p>
      </div>
      <RowContainer>
        <Row
          title="Mensualité PTZ"
          value={formatEuro(Number(phase.mensualitePTZ), 2)}
          status={phase.mensualitePTZ === '0.00' ? 'default' : 'info'} />
        <Row
          title="Mensualité principale"
          value={`+ ${formatEuro(Number(phase.mensualiteClassique), 2)}`}
          status={phase.mensualiteClassique === '0.00' ? 'default' : 'info'}
          tooltip="Hors assurance emprunteur." />
        <div class="separator"></div>
        <Row
          title="Mensualité globale"
          value={`= ${formatEuro(
            Number(phase.mensualitePTZ) + Number(phase.mensualiteClassique),
            2,
          )}`}
          status="new" />
      </RowContainer>
    </Block>
  {/each}
{/if}
