<script lang="ts">
  import { page } from "$app/state";
  import { default as Logo } from "$assets/logo.svg?raw";

  let { data, children } = $props();
  const user = data.user!;

  let search = $state("");
  let switcherOpen = $state(false);

  const currentOfsLabel = $derived(
    page.data.currentOfs?.name || "Sélectionner un OFS",
  );
  const canSwitch = $derived(
    (data.selectableOfss?.length || 0) > 1 || user.canAccessAllOfss,
  );
  const showSearch = $derived((data.selectableOfss?.length || 0) > 5);
  const filteredOfss = $derived(
    (data.selectableOfss || []).filter((ofs) =>
      ofs.name
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .includes(
          search
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .toLowerCase(),
        ),
    ),
  );

  function openSwitcher() {
    switcherOpen = true;
  }

  function closeSwitcher() {
    switcherOpen = false;
    search = "";
  }
</script>

<svelte:head>
  <title>BoRiS</title>
</svelte:head>

<header class="fr-header">
  <div class="fr-header__body">
    <div class="fr-container">
      <div class="fr-header__body-row">
        <div class="fr-header__brand fr-enlarge-link">
          <div class="fr-header__brand-top">
            <div class="fr-header__logo">
              <p class="fr-logo">
                Ministère <br />
                chargé
                <br />
                du logement
              </p>
            </div>
            <div class="fr-header__operator">
              {@html Logo}
            </div>
            <div class="fr-header__navbar">
              <button
                class="fr-btn--menu fr-btn"
                data-fr-opened="false"
                aria-controls="menu-mobile"
                title="Menu"
              >
                Menu
              </button>
            </div>
          </div>
          <div class="fr-header__service">
            <a href="/" title="Accueil - Boris - Ministère chargé du logement">
              <p class="fr-header__service-title">BoRiS</p>
            </a>
            <p class="fr-header__service-tagline">Espace OFS</p>
          </div>
        </div>
        <div class="fr-header__tools">
          <div class="fr-header__tools-links">
            <ul class="fr-btns-group fr-btns-group--inline fr-btns-group--sm">
              <li>
                <span class="fr-text--sm">{user.email}</span>
                {#if user.roles.includes("admin")}
                  <span
                    class="fr-badge fr-badge--sm fr-badge--blue-cumulus fr-ml-1w"
                    >Admin</span
                  >
                {/if}
              </li>
              <li>
                <form method="POST" action="/deconnexion">
                  <button
                    class="fr-btn fr-btn--tertiary-no-outline"
                    type="submit">Déconnexion</button
                  >
                </form>
              </li>
            </ul>
          </div>
          <div class="fr-header__search fr-modal" id="search-modal-id">
            {#if canSwitch}
              <details
                bind:open={switcherOpen}
                class="fr-mr-2w"
                style="position: relative;"
              >
                <summary
                  class="fr-btn fr-btn--secondary fr-icon-arrow-down-s-line fr-btn--icon-right"
                  aria-label="Sélectionner un OFS"
                  style="min-width: 18rem; justify-content: space-between;"
                >
                  {currentOfsLabel}
                </summary>

                <div
                  class="fr-p-2w fr-shadow-6"
                  style="position: absolute; right: 0; top: calc(100% + 0.5rem); width: 22rem; z-index: 1000; border-radius: 0.5rem; box-sizing: border-box;"
                  style:background="white"
                >
                  {#if showSearch}
                    <div class="fr-input-group fr-mb-2w">
                      <label class="fr-sr-only" for="ofs-switcher-search"
                        >Rechercher un OFS</label
                      >
                      <input
                        id="ofs-switcher-search"
                        class="fr-input"
                        type="search"
                        bind:value={search}
                        placeholder="Rechercher un OFS"
                      />
                    </div>
                  {/if}

                  <div style="max-height: 18rem; overflow-y: auto;">
                    {#if filteredOfss.length === 0}
                      <p class="fr-text--sm fr-mb-0">
                        Aucun OFS ne correspond à votre recherche.
                      </p>
                    {:else}
                      <ul class="fr-menu__list">
                        {#each filteredOfss as ofs}
                          <li>
                            <a
                              class="fr-nav__link"
                              href={`/ofs/${ofs.id}`}
                              onclick={closeSwitcher}>{ofs.name}</a
                            >
                          </li>
                        {/each}
                      </ul>
                    {/if}
                  </div>
                </div>
              </details>
            {:else if page.data.currentOfs}
              <span class="fr-mr-2w fr-text--sm"
                >{page.data.currentOfs.name}</span
              >
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
  {#if page.data.currentOfs}
    <div class="fr-header__menu fr-modal" id="menu-modal">
      <div class="fr-container">
        <nav class="fr-nav" aria-label="Navigation principale OFS">
          <ul class="fr-nav__list">
            <li class="fr-nav__item">
              <a
                class="fr-nav__link"
                aria-current={page.url.pathname ===
                  `/ofs/${page.data.currentOfs.id}/simulations` ||
                page.url.pathname === `/ofs/${page.data.currentOfs.id}`
                  ? "page"
                  : undefined}
                href={`/ofs/${page.data.currentOfs.id}/simulations`}
                target="_self"
              >
                Simulations
              </a>
            </li>
            <li class="fr-nav__item">
              <a
                class="fr-nav__link"
                aria-current={page.url.pathname ===
                `/ofs/${page.data.currentOfs.id}/profil`
                  ? "page"
                  : undefined}
                href={`/ofs/${page.data.currentOfs.id}/profil`}
                target="_self"
              >
                Profil
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  {/if}
</header>

<main class="fr-container fr-py-4w">
  {#if data.flash}
    <div class={`fr-alert fr-alert--${data.flash.type} fr-mb-3w`}>
      <p>{data.flash.message}</p>
    </div>
  {/if}

  {@render children()}
</main>
