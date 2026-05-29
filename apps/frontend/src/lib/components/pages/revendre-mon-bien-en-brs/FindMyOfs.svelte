<script lang="ts">
  import Accordion from '$components/common/Accordion.svelte';

  type FindMyOfsProgram = {
    name: string;
    address: string;
    city: string;
    zipcode: string;
    deliveryMonth: string | null;
  };

  type FindMyOfsResult = {
    ofs: {
      id: string;
      name: string;
      websiteUrl: string | null;
      phone: string | null;
      email: string | null;
    };
    distance: number;
    nearestProgram: FindMyOfsProgram;
    programs: FindMyOfsProgram[];
  };

  let address = $state('');
  let isLoading = $state(false);
  let error = $state<string | null>(null);
  let results = $state<FindMyOfsResult[]>([]);
  let hasSearched = $state(false);

  const formatDistance = (distance: number): string => {
    if (distance < 1000) {
      return `${Math.round(distance)} m`;
    }

    return `${(distance / 1000).toFixed(1).replace('.', ',')} km`;
  };

  const formatProgramCount = (count: number): string => {
    return `${count} programme${count > 1 ? 's' : ''}`;
  };

  const formatProgramLocation = (program: FindMyOfsProgram): string => {
    return `${program.address}, ${program.zipcode} ${program.city}`;
  };

  const findMyOfs = async () => {
    const trimmedAddress = address.trim();

    if (!trimmedAddress) {
      error = 'Saisissez une adresse pour lancer la recherche.';
      results = [];
      return;
    }

    isLoading = true;
    error = null;
    hasSearched = true;

    try {
      const url = new URL('/api/find-my-ofs', window.location.origin);
      url.searchParams.set('address', trimmedAddress);

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'La recherche a échoué.');
      }

      results = data;
    } catch (e) {
      error = e instanceof Error ? e.message : 'La recherche a échoué.';
      results = [];
    } finally {
      isLoading = false;
    }
  };
</script>

<section class="fr-container rounded-lg bg-white">
  <div class="py-4 px-1 md:px-4">
    <div class="find-my-ofs-grid">
      <div>
        <p class="fr-text--lg fr-mb-0">
          Votre OFS est inscrit sur le bail signé chez le notaire au moment de
          votre achat. Vous pouvez aussi le retrouver sur votre avis de
          redevance mensuel.
        </p>
      </div>

      <form
        class="find-my-ofs-form"
        onsubmit={(event) => {
          event.preventDefault();
          findMyOfs();
        }}>
        <div class="fr-input-group fr-mb-2w">
          <label
            class="fr-label"
            for="find-my-ofs-address">
            Adresse du logement
          </label>
          <input
            id="find-my-ofs-address"
            class="fr-input"
            name="address"
            type="search"
            autocomplete="street-address"
            bind:value={address}
            placeholder="12 rue de la Paix, 44000 Nantes" />
        </div>

        <button
          class="fr-btn"
          type="submit"
          disabled={isLoading}>
          {isLoading ? 'Recherche...' : 'Rechercher'}
        </button>
      </form>
    </div>

    {#if error}
      <p class="fr-error-text fr-mt-3w">{error}</p>
    {/if}

    {#if hasSearched && !isLoading && !error}
      {#if results.length}
        <ul class="find-my-ofs-results fr-mt-4w">
          {#each results as result}
            <li class="find-my-ofs-result">
              <div>
                <p class="fr-text--bold fr-mb-1v">{result.ofs.name}</p>
                <p class="fr-text--sm fr-mb-0">
                  Programme le plus proche à {formatDistance(result.distance)}
                </p>
                <div class="find-my-ofs-programs fr-mt-2v">
                  <Accordion
                    label={`Voir les ${formatProgramCount(result.programs.length)}`}>
                    <ul class="find-my-ofs-program-list">
                      {#each result.programs as program}
                        <li class="find-my-ofs-program-item">
                          <p class="fr-text--sm fr-mb-0">
                            {formatProgramLocation(program)}
                          </p>
                        </li>
                      {/each}
                    </ul>
                  </Accordion>
                </div>
              </div>

              <div class="find-my-ofs-actions">
                {#if result.ofs.phone}
                  <a
                    class="fr-btn fr-btn--secondary fr-btn--sm"
                    href={`tel:${result.ofs.phone}`}>
                    Appeler
                  </a>
                {/if}
                {#if result.ofs.email}
                  <a
                    class="fr-btn fr-btn--secondary fr-btn--sm"
                    href={`mailto:${result.ofs.email}`}>
                    Écrire
                  </a>
                {/if}
                {#if result.ofs.websiteUrl}
                  <a
                    class="fr-btn fr-btn--tertiary fr-btn--sm"
                    href={result.ofs.websiteUrl}
                    target="_blank">
                    Site web
                  </a>
                {/if}
              </div>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="fr-info-text fr-mt-3w">
          Aucun OFS candidat trouvé dans un rayon de 10 km.
        </p>
      {/if}
    {/if}
  </div>
</section>

<style>
  .find-my-ofs-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;
  }

  .find-my-ofs-form {
    align-self: end;
  }

  .find-my-ofs-results {
    display: grid;
    gap: 1rem;
    list-style: none;
    padding: 0;
  }

  .find-my-ofs-result {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: space-between;
    border: 1px solid var(--border-default-grey);
    padding: 1rem;
  }

  .find-my-ofs-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .find-my-ofs-programs {
    max-width: 36rem;
  }

  .find-my-ofs-program-list {
    display: grid;
    gap: 0.75rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .find-my-ofs-program-item {
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-default-grey);
  }

  .find-my-ofs-program-item:first-child {
    padding-top: 0;
    border-top: 0;
  }

  @media (min-width: 48em) {
    .find-my-ofs-grid {
      grid-template-columns: minmax(0, 1fr) minmax(20rem, 0.7fr);
      align-items: center;
    }

    .find-my-ofs-result {
      flex-direction: row;
      align-items: center;
    }
  }
</style>
