<script lang="ts">
  import '@gouvfr/dsfr/dist/component/form/form.min.css';
  import '@gouvfr/dsfr/dist/component/input/input.min.css';
  import '@gouvfr/dsfr/dist/component/radio/radio.min.css';
  import '@gouvfr/dsfr/dist/component/tooltip/tooltip.min.css';
  import '@gouvfr/dsfr/dist/component/table/table.min.css';
  import '@gouvfr/dsfr/dist/component/alert/alert.min.css';

  import Section from '$components/common/Section.svelte';
  import Tooltip from '$components/common/Tooltip.svelte';

  let housingPrice: number = $state(0);
  let housingType: 'new' | 'old' = $state('new');
  let ownContribution: number = $state(0);
  let notaryFees: number = $state(0);
  let loanFees: number = $state(0);
  let realEstateFees: number = $state(0);
  let oneTimeExpenses: number = $state(0);
  let interestRate: number = $state(0);
  let loanDuration: number = $state(0);
  let brsFees: number = $state(0);
  let propertyTax: number = $state(0);
  let yearlyExpenses: number = $state(0);

  let estimatedNotaryFees: number = $derived.by(() => {
    if (housingPrice) {
      if (housingType === 'new') {
        return Math.round(housingPrice * 0.023);
      } else {
        return Math.round(housingPrice * 0.078);
      }
    }

    return 0;
  });

  let estimatedNotaryFeesString: string = $derived.by(() => {
    if (estimatedNotaryFees) {
      if (housingType === 'new') {
        return `${Math.round(estimatedNotaryFees)}€ (2,3% du prix)`;
      } else {
        return `${Math.round(estimatedNotaryFees)}€ (7,8% du prix)`;
      }
    }

    return '';
  });

  let estimatedLoanFees: number = $derived.by(() => {
    if (!housingPrice) return 0;
    return Math.max(1000, Math.min(2500, Math.round(housingPrice * 0.01)));
  });

  let estimatedRealEstateFees: number = $derived.by(() => {
    if (!housingPrice) return 0;
    return Math.round(housingPrice * 0.055);
  });

  let totalFees: number = $derived(
    (notaryFees || estimatedNotaryFees) +
      (loanFees || estimatedLoanFees) +
      (realEstateFees || estimatedRealEstateFees) +
      oneTimeExpenses,
  );

  let ownContributionAfterFees: number = $derived(ownContribution - totalFees);

  let loanAmount: number = $derived(housingPrice - ownContributionAfterFees);

  let loanMonthlyCost = $derived.by(() => {
    if (!loanAmount || !interestRate || !loanDuration) return 0;

    return Math.round(
      (loanAmount * (interestRate / 1200)) /
        (1 - Math.pow(1 + interestRate / 1200, -loanDuration * 12)),
    );
  });

  let monthlyCost: number = $derived(
    loanMonthlyCost + brsFees + (propertyTax + yearlyExpenses) / 12,
  );
</script>

<svelte:head>
  <title>Simulateur d'acquisition en BRS | BoRiS</title>
  <meta
    name="robots"
    content="noindex, nofollow" />
</svelte:head>

<div class="container">
  <div class="wrapper">
    <Section
      title="Simulateur d’acquisition en BRS"
      titleElement="h1">
      <form autocomplete="off">
        <div class="fieldset-container">
          <fieldset class="fr-fieldset">
            <legend class="fr-h4">1. Prix du logement</legend>
            <div class="fr-fieldset__element">
              <label
                class="fr-label"
                for="housing-price">
                Prix du logement (€)
                <Tooltip>
                  <div class="fr-p-2w">
                    Prix de vente affiché par l’opérateur ou le promoteur, hors
                    frais annexes.
                  </div>
                </Tooltip>
              </label>
              <input
                class="fr-input"
                type="number"
                id="housing-price"
                min="10000"
                step="1000"
                required
                placeholder="Exemple: 180000"
                oninput={(e) => {
                  housingPrice = Number((e.target as HTMLInputElement).value);
                }} />
            </div>
            <div class="fr-fieldset__element">
              <label class="fr-label fr-mb-1w">
                Type de bien
                <Tooltip>
                  <div class="fr-p-2w">
                    Le taux des frais de notaire dépend du type de bien.
                    <ul>
                      <li>Neuf: logement jamais habité.</li>
                      <li>Ancien: logement déjà occupé.</li>
                    </ul>
                  </div>
                </Tooltip>
              </label>
              <div class="fr-input-wrap">
                <div class="fr-radio-group fr-mb-1v">
                  <input
                    type="radio"
                    id="bien-neuf"
                    name="type-bien"
                    value="new"
                    oninput={() => {
                      housingType = 'new';
                    }}
                    checked={housingType === 'new'} />
                  <label for="bien-neuf">Neuf</label>
                </div>
                <div class="fr-radio-group">
                  <input
                    type="radio"
                    id="bien-ancien"
                    name="type-bien"
                    value="old"
                    oninput={() => {
                      housingType = 'old';
                    }}
                    checked={housingType === 'old'} />
                  <label for="bien-ancien">Ancien</label>
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        <div class="fieldset-container">
          <fieldset class="fr-fieldset">
            <legend class="fr-h4">2. Votre apport personnel</legend>
            <div class="fr-fieldset__element">
              <label
                class="fr-label"
                for="own-contribution">
                Montant de votre apport (€)
                <Tooltip>
                  <div class="fr-p-2w">
                    Somme dont vous disposez pour le projet (épargne, donation,
                    aide familiale, etc.).
                  </div>
                </Tooltip>
              </label>
              <input
                class="fr-input"
                type="number"
                id="own-contribution"
                min="0"
                step="500"
                required
                placeholder="Exemple: 25000"
                oninput={(e) => {
                  ownContribution = Number(
                    (e.target as HTMLInputElement).value,
                  );
                }} />
            </div>
          </fieldset>
        </div>

        <div class="fieldset-container">
          <fieldset class="fr-fieldset">
            <legend class="fr-h4">3. Frais annexes à l’acquisition</legend>
            <div class="fr-fieldset__element">
              <label
                class="fr-label"
                for="notary-fees">
                Frais de notaire (€)
                <Tooltip>
                  <div class="fr-p-2w">
                    Frais obligatoires lors de l’achat, couvrant taxes et
                    rémunération du notaire.
                    <ul>
                      <li>Pour un achat neuf: 2,3% du prix du logement</li>
                      <li>Pour de l’ancien: 7,8%.</li>
                    </ul>
                  </div>
                </Tooltip>
              </label>
              <input
                class="fr-input"
                type="number"
                id="notary-fees"
                min="0"
                step="100"
                placeholder="Laissez vide pour estimation automatique"
                oninput={(e) => {
                  notaryFees = Number((e.target as HTMLInputElement).value);
                }} />
              {#if notaryFees === 0 && housingPrice}
                <p>
                  Estimation automatique: <b>{estimatedNotaryFeesString}</b>
                </p>
              {/if}
            </div>

            <div class="fr-fieldset__element">
              <label
                class="fr-label"
                for="loan-fees">
                Frais de garantie/prêt (€)
                <Tooltip>
                  <div class="fr-p-2w">
                    Frais liés à la mise en place de votre prêt immobilier
                    (caution, garantie, dossier). Généralement entre 1 000€ et 2
                    500€.
                  </div>
                </Tooltip>
              </label>
              <input
                class="fr-input"
                type="number"
                id="loan-fees"
                min="0"
                step="50"
                placeholder="Laissez vide pour estimation automatique"
                oninput={(e) => {
                  loanFees = Number((e.target as HTMLInputElement).value);
                }} />
              {#if loanFees === 0 && housingPrice}
                <p>
                  Estimation automatique: <b>{estimatedLoanFees}€</b>
                </p>
              {/if}
            </div>

            <div class="fr-fieldset__element">
              <label
                class="fr-label"
                for="real-estate-fees">
                Frais d’agence immobilière (€)
                <Tooltip>
                  <div class="fr-p-2w">
                    Si l’achat se fait via une agence, prévoir entre 3% et 8% du
                    prix du bien. Laissez vide si achat sans agence.
                  </div>
                </Tooltip>
              </label>
              <input
                class="fr-input"
                type="number"
                id="real-estate-fees"
                min="0"
                step="100"
                placeholder="Laissez vide pour estimation automatique"
                oninput={(e) => {
                  realEstateFees = Number((e.target as HTMLInputElement).value);
                }} />
              {#if realEstateFees === 0 && housingPrice}
                <p>
                  Estimation automatique: <b>
                    {estimatedRealEstateFees}€ (5,5% du prix)
                  </b>
                </p>
              {/if}
            </div>

            <div class="fr-fieldset__element">
              <label
                class="fr-label"
                for="one-time-expenses">
                Autres frais ponctuels (€)
                <Tooltip>
                  <div class="fr-p-2w">
                    Déménagement, ouverture de compteurs, frais administratifs,
                    etc. Optionnel.
                  </div>
                </Tooltip>
              </label>
              <input
                class="fr-input"
                type="number"
                id="one-time-expenses"
                min="0"
                step="100"
                placeholder="Exemple: 1200€"
                oninput={(e) => {
                  oneTimeExpenses = Number(
                    (e.target as HTMLInputElement).value,
                  );
                }} />
            </div>
          </fieldset>
        </div>

        <div class="fieldset-container">
          <fieldset class="fr-fieldset">
            <legend class="fr-h4">4. Synthèse de l’apport et des frais</legend>
            <div class="fr-table fr-table--lg fr-table--no-caption">
              <div class="fr-table__wrapper">
                <div class="fr-table__container">
                  <div class="fr-table__content">
                    <table>
                      <thead>
                        <tr>
                          <th>Poste</th>
                          <th>Montant (€)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Prix du logement</td>
                          <td>
                            {housingPrice || '-'}
                          </td>
                        </tr>
                        <tr>
                          <td>Apport personnel</td>
                          <td>
                            {ownContribution || '-'}
                          </td>
                        </tr>
                        <tr>
                          <td>Frais de notaire</td>
                          <td>
                            {notaryFees || estimatedNotaryFees || '-'}
                          </td>
                        </tr>
                        <tr>
                          <td>Frais de garantie/prêt</td>
                          <td>
                            {loanFees || estimatedLoanFees || '-'}
                          </td>
                        </tr>
                        <tr>
                          <td>Frais d’agence</td>
                          <td>
                            {realEstateFees || estimatedRealEstateFees || '-'}
                          </td>
                        </tr>
                        <tr>
                          <td>Autres frais ponctuels</td>
                          <td>
                            {oneTimeExpenses || '-'}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <th>Total frais annexes</th>
                          <th>
                            {housingPrice + ownContribution + totalFees || '-'}
                          </th>
                        </tr>
                        <tr>
                          <th>Apport restant après frais</th>
                          <th>
                            {ownContributionAfterFees > 0
                              ? ownContributionAfterFees
                              : '-'}
                          </th>
                        </tr>
                        <tr>
                          <th>Besoin d’emprunt</th>
                          <th>
                            {housingPrice - ownContributionAfterFees || '-'}
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="fr-btn fr-btn--secondary fr-btn--download"
              onclick={() => window.print()}>
              Télécharger le récapitulatif
            </button>
          </fieldset>
        </div>

        <div class="fieldset-container">
          <fieldset class="fr-fieldset">
            <legend class="fr-h4">5. Simulation de votre emprunt</legend>

            <div class="fr-fieldset__element">
              <a
                href="https://www.calcul-ptz.fr/lissage.php"
                class="fr-link fr-text--sm"
                target="_blank"
                rel="noopener noreferrer">
                <b>
                  Simulez votre prêt immobilier (avec PTZ, lissage, etc.) sur un
                  simulateur spécialisé
                </b>
              </a>
            </div>

            <div class="fr-fieldset__element">
              <label
                class="fr-label"
                for="interest-rate">
                Taux d’intérêt de votre crédit (%)
                <Tooltip>
                  <div class="fr-p-2w">
                    Taux annuel effectif global (TAEG) proposé par votre banque.
                    Indiquez 0 si vous n’avez pas encore d’offre.
                  </div>
                </Tooltip>
              </label>
              <input
                class="fr-input"
                type="number"
                id="interest-rate"
                min="0"
                max="100"
                step="0.01"
                placeholder="Exemple: 3.25"
                oninput={(e) => {
                  interestRate = Number((e.target as HTMLInputElement).value);
                }} />
            </div>

            <div class="fr-fieldset__element">
              <label
                class="fr-label"
                for="loan-duration">
                Durée de remboursement (années)
                <Tooltip>
                  <div class="fr-p-2w">Durée classique: 20 à 25 ans.</div>
                </Tooltip>
              </label>
              <input
                class="fr-input"
                type="number"
                id="loan-duration"
                min="5"
                max="30"
                step="1"
                placeholder="Exemple: 25"
                oninput={(e) => {
                  loanDuration = Number((e.target as HTMLInputElement).value);
                }} />
            </div>

            <div class="fr-fieldset__element">
              <label
                class="fr-label"
                for="loan-amount">
                Montant à emprunter (€)
              </label>
              <input
                class="fr-input"
                type="number"
                id="loan-amount"
                min="0"
                step="100"
                placeholder="Exemple: 180000"
                value={loanAmount}
                oninput={(e) => {
                  loanAmount = Number((e.target as HTMLInputElement).value);
                }} />
            </div>
            <p>
              <b>
                Mensualité estimée: {loanMonthlyCost
                  ? `${loanMonthlyCost}€ (hors assurance)`
                  : '-'}
              </b>
            </p>
          </fieldset>
        </div>

        <div class="fieldset-container">
          <fieldset class="fr-fieldset">
            <legend class="fr-h4">6. Redevance BRS & charges mensuelles</legend>

            <div class="fr-fieldset__element">
              <label
                class="fr-label"
                for="brs-fees">
                Redevance BRS (€ / mois)
              </label>
              <input
                class="fr-input"
                type="number"
                id="brs-fees"
                min="0"
                step="1"
                placeholder="Ex : 1,50 €/m²"
                oninput={(e) => {
                  brsFees = Number((e.target as HTMLInputElement).value);
                }} />
            </div>

            <div class="fr-fieldset__element">
              <label
                class="fr-label"
                for="property-tax">
                Taxe foncière (€ / an)
              </label>
              <input
                class="fr-input"
                type="number"
                id="property-tax"
                min="0"
                step="1"
                placeholder="Ex : 900"
                oninput={(e) => {
                  propertyTax = Number((e.target as HTMLInputElement).value);
                }} />
            </div>

            <div class="fr-fieldset__element">
              <label
                class="fr-label"
                for="yearly-expenses">
                Autres charges annuelles (€ / an)
              </label>
              <input
                class="fr-input"
                type="number"
                id="yearly-expenses"
                min="0"
                step="1"
                placeholder="Ex : 600"
                oninput={(e) => {
                  yearlyExpenses = Number((e.target as HTMLInputElement).value);
                }} />
            </div>

            <div>
              <p class="fr-mb-0">
                <b>Coût mensuel estimé (hors charges courantes):</b>
              </p>
              <ul>
                <li>
                  Mensualité de crédit: {loanMonthlyCost || '-'}€
                </li>
                <li>
                  Redevance BRS: {brsFees || ''}€
                </li>
                <li>
                  Taxe foncière: {propertyTax || '-'}€/an ({propertyTax
                    ? Math.round(propertyTax / 12)
                    : '-'}€/mois)
                </li>
                <li>
                  Autres charges: {yearlyExpenses || '-'}€/an ({yearlyExpenses
                    ? Math.round(yearlyExpenses / 12)
                    : '-'}€/mois)
                </li>
              </ul>
              <p>
                <b>
                  Total mensuel estimé: {monthlyCost
                    ? Math.round(monthlyCost)
                    : '-'}€
                </b>
              </p>
              {#if monthlyCost}
                <div class="fr-alert fr-alert--error fr-mb-2w">
                  <span>
                    Attention: ce montant ne comprend pas l’assurance emprunteur
                    ni les charges courantes (eau, énergie, etc.).
                  </span>
                </div>
              {/if}
              <div>
                <strong>
                  Coût annuel global: {monthlyCost
                    ? Math.round(monthlyCost * 12)
                    : '-'}€
                </strong>
              </div>
            </div>
          </fieldset>
        </div>
      </form>
    </Section>
  </div>
</div>

<style lang="postcss">
  .container {
    background-color: #f8f8ff;
  }

  .wrapper {
    max-width: 700px;
    margin: 0 auto;
  }

  .fieldset-container {
    background-color: white;
    padding: var(--2w);
    border-radius: var(--1w);
    box-shadow: 0 2px 8px #eee;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--6w);
  }

  fieldset {
    padding: 0.75rem;
  }

  label {
    display: inline-flex;
    align-items: flex-end;
    gap: var(--1v);
  }

  .fr-table {
    width: 100%;
    border: 1px solid var(--border-contrast-grey);
    border-bottom: none;

    th:nth-child(even) {
      border-left: 1px solid var(--border-plain-grey);
    }

    td:nth-child(even) {
      border-left: 1px solid var(--border-contrast-grey);
    }

    tfoot tr {
      background-color: var(--background-alt-grey);
      border-bottom: 1px solid var(--border-contrast-grey);
    }
  }
</style>
