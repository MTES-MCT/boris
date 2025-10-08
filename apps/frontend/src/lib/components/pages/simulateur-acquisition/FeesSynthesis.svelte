<script lang="ts">
  import { formatEuro } from '$lib/utils/formatters';

  import Element from './Synthesis/Element.svelte';
  import Row from './Synthesis/Row.svelte';
  import RowContainer from './Synthesis/RowContainer.svelte';

  import acquisitionSimulatorManager from '$lib/managers/acquisition-simulator.svelte';

  const {
    monthlyBrsFees,
    yearlyBrsFees,
    monthlyPropertyTax,
    yearlyPropertyTax,
    monthlyHouseingInsurance,
    yearlyHouseingInsurance,
    monthlyCondominiumFees,
    yearlyCondominiumFees,
    monthlyExpenses,
    yearlyExpenses,
  } = $derived(acquisitionSimulatorManager);
</script>

<Element>
  <p class="fr-h6">Coût mensuel</p>
  <RowContainer>
    <Row
      title="Redevance BRS"
      value={monthlyBrsFees ? formatEuro(monthlyBrsFees, 2) : 'Non renseigné'}
      status={monthlyBrsFees ? 'info' : 'default'}
      tooltip="Le resultat est égal à la redevance BRS mensuelle par m² multipliée par la surface du logement." />
    <Row
      title="Taxe foncière"
      value={monthlyPropertyTax
        ? `+ ${formatEuro(monthlyPropertyTax, 2)}`
        : 'Non renseigné'}
      status={monthlyPropertyTax ? 'info' : 'default'} />
    <Row
      title="Assurance habitation"
      value={monthlyHouseingInsurance
        ? `+ ${formatEuro(monthlyHouseingInsurance, 2)}`
        : 'Non renseigné'}
      status={monthlyHouseingInsurance ? 'info' : 'default'} />
    <Row
      title="Charges de copropriété"
      value={monthlyCondominiumFees
        ? `+ ${formatEuro(monthlyCondominiumFees, 2)}`
        : 'Non renseigné'}
      status={monthlyCondominiumFees ? 'info' : 'default'} />
    <Row
      title="Autres charges"
      value={monthlyExpenses
        ? `+ ${formatEuro(monthlyExpenses, 2)}`
        : 'Non renseigné'}
      status={monthlyExpenses ? 'info' : 'default'} />

    <div class="separator"></div>

    <Row
      title="Coût total mensuel"
      value={`= ${formatEuro(
        monthlyBrsFees +
          monthlyPropertyTax +
          monthlyHouseingInsurance +
          monthlyCondominiumFees +
          monthlyExpenses,
        2,
      )}
      `}
      status="success" />
  </RowContainer>
</Element>

<Element isLast>
  <p class="fr-h6">Coût annuel</p>
  <RowContainer>
    <Row
      title="Redevance BRS"
      value={yearlyBrsFees ? formatEuro(yearlyBrsFees, 2) : 'Non renseigné'}
      status={yearlyBrsFees ? 'info' : 'default'}
      tooltip="Le resultat est égal à la redevance BRS mensuelle par m² multipliée par la surface du logement." />
    <Row
      title="Taxe foncière"
      value={yearlyPropertyTax
        ? `+ ${formatEuro(yearlyPropertyTax, 2)}`
        : 'Non renseigné'}
      status={yearlyPropertyTax ? 'info' : 'default'} />
    <Row
      title="Assurance habitation"
      value={yearlyHouseingInsurance
        ? `+ ${formatEuro(yearlyHouseingInsurance, 2)}`
        : 'Non renseigné'}
      status={yearlyHouseingInsurance ? 'info' : 'default'} />
    <Row
      title="Charges de copropriété"
      value={yearlyCondominiumFees
        ? `+ ${formatEuro(yearlyCondominiumFees, 2)}`
        : 'Non renseigné'}
      status={yearlyCondominiumFees ? 'info' : 'default'} />
    <Row
      title="Autres charges"
      value={yearlyExpenses
        ? `+ ${formatEuro(yearlyExpenses, 2)}`
        : 'Non renseigné'}
      status={yearlyExpenses ? 'info' : 'default'} />

    <div class="separator"></div>

    <Row
      title="Coût total annuel"
      value={`= ${formatEuro(
        yearlyBrsFees + (yearlyPropertyTax as number) ||
          0 + (yearlyHouseingInsurance as number) ||
          0 + (yearlyCondominiumFees as number) ||
          0 + (yearlyExpenses as number) ||
          0,
        2,
      )}
      `}
      status="success" />
  </RowContainer>
</Element>
