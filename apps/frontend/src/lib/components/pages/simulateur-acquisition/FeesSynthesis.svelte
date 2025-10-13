<script lang="ts">
  import { formatEuro } from '$lib/utils/formatters';

  import Block from '$components/pages/simulateur-acquisition/synthesis/Block.svelte';
  import Row from '$components/pages/simulateur-acquisition/synthesis/Row.svelte';
  import RowContainer from '$components/pages/simulateur-acquisition/synthesis/RowContainer.svelte';

  import acquisitionSimulatorManager from '$lib/managers/acquisition-simulator.svelte';
  import type { PhaseRemboursement } from '$lib/utils/lissage-ptz';

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
    pretLisse,
  } = $derived(acquisitionSimulatorManager);

  const lissage = $derived(pretLisse?.lisser() as PhaseRemboursement[]);

  let mensualiteDepensesTotales = $derived(
    monthlyBrsFees +
      monthlyPropertyTax +
      monthlyHouseingInsurance +
      monthlyCondominiumFees +
      (monthlyExpenses as number),
  );

  let mensualitePretTotale = $derived(
    Number(lissage[0].mensualiteClassique) + Number(lissage[0].mensualitePTZ),
  );

  let annuiteDepensesTotales = $derived(
    yearlyBrsFees +
      ((yearlyPropertyTax as number) || 0) +
      ((yearlyHouseingInsurance as number) || 0) +
      ((yearlyCondominiumFees as number) || 0) +
      ((yearlyExpenses as number) || 0),
  );

  let annuitePretTotalee = $derived(mensualitePretTotale * 12);
</script>

<Block>
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
      title="Dépenses mensuelles globales"
      value={`= ${formatEuro(mensualiteDepensesTotales, 2)}
      `}
      status="success" />
    <Row
      title="Mensualité du prêt"
      value={`+ ${formatEuro(mensualitePretTotale, 2)}
      `}
      status="info" />

    <div class="separator"></div>

    <Row
      title="Coût total mensuel"
      value={`= ${formatEuro(
        mensualiteDepensesTotales + mensualitePretTotale,
        2,
      )}
      `}
      status="success" />
  </RowContainer>
</Block>

<Block isLast>
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
      title="Dépenses annuelles globales"
      value={`= ${formatEuro(annuiteDepensesTotales, 2)}
      `}
      status="success" />

    <Row
      title="Annuité du prêt"
      value={`+ ${formatEuro(annuitePretTotalee, 2)}
        `}
      status="info" />

    <div class="separator"></div>

    <Row
      title="Coût total annuel"
      value={`= ${formatEuro(annuiteDepensesTotales + annuitePretTotalee, 2)}
      `}
      status="success" />
  </RowContainer>
</Block>
