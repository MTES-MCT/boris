<script lang="ts">
  import '@gouvfr/dsfr/dist/component/link/link.main.min.css';
  import '@gouvfr/dsfr/dist/component/button/button.min.css';
  import '@gouvfr/dsfr/dist/component/logo/logo.min.css';
  import '@gouvfr/dsfr/dist/component/navigation/navigation.min.css';
  import '@gouvfr/dsfr/dist/component/modal/modal.min.css';
  import '@gouvfr/dsfr/dist/component/header/header.min.css';

  onMount(async () => {
    // @ts-expect-error: no declaration file
    await import('@gouvfr/dsfr/dist/core/core.module.min');
    await import(
      // @ts-expect-error: no declaration file
      '@gouvfr/dsfr/dist/component/navigation/navigation.module.min'
    );
    // @ts-expect-error: no declaration file
    await import('@gouvfr/dsfr/dist/component/modal/modal.module.min.js');
    // @ts-expect-error: no declaration file
    await import('@gouvfr/dsfr/dist/component/header/header.module.min.js');
  });

  import { page } from '$app/stores';
  import { default as Logo } from '$assets/illustrations/logo.svg?raw';
  import { onMount } from 'svelte';
  import { steps } from '$routes/tout-savoir-sur-le-bail-reel-solidaire-brs/[slug]/content';

  let pathname = $state($page.url.pathname);

  $effect(() => {
    pathname = $page.url.pathname;
  });
</script>

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
                title="Menu">
                Menu
              </button>
            </div>
          </div>
          <div class="fr-header__service">
            <a
              href="/"
              title="Accueil - Boris - Ministère chargé du logement">
              <p class="fr-header__service-title">BoRiS</p>
            </a>
            <p class="fr-header__service-tagline">
              Ensemble, facilitons l’accès à la propriété pour tous·tes
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="fr-header__menu fr-modal"
    id="menu-mobile"
    aria-labelledby="menu-mobile">
    <div class="fr-container">
      <button
        class="fr-btn--close fr-btn"
        aria-controls="menu-mobile"
        title="Fermer">
        Fermer
      </button>
      <div class="fr-header__menu-links"></div>
      <nav
        class="fr-nav"
        aria-label="Menu principal">
        <ul class="fr-nav__list">
          <li class="fr-nav__item">
            <a
              class="fr-nav__link"
              href="/simulateur-eligibilite"
              aria-current={pathname === '/simulateur-eligibilite'}
              target="_self">
              Le simulateur BoRiS
            </a>
          </li>
          <li class="fr-nav__item">
            <a
              class="fr-nav__link"
              href="/logements-brs-disponibles"
              aria-current={pathname === '/logements-brs-disponibles'}
              target="_self">
              Trouver un logement en BRS
            </a>
          </li>
          <li class="fr-nav__item">
            <button
              aria-expanded="false"
              aria-controls="tout-savoir-sur-le-bail-reel-solidaire-brs-dropdown"
              aria-current={pathname.includes(
                '/tout-savoir-sur-le-bail-reel-solidaire-brs',
              )}
              class="fr-nav__btn">
              Qu'est ce que le BRS ?
            </button>
            <div
              class="fr-collapse fr-menu"
              id="tout-savoir-sur-le-bail-reel-solidaire-brs-dropdown">
              <ul class="fr-menu__list">
                <li>
                  <a
                    href="/tout-savoir-sur-le-bail-reel-solidaire-brs"
                    aria-current={pathname ===
                      '/tout-savoir-sur-le-bail-reel-solidaire-brs'}
                    class="fr-nav__link">
                    Les étapes du parcours d'achat
                  </a>
                </li>
                {#each steps as step}
                  {@const href = `/tout-savoir-sur-le-bail-reel-solidaire-brs/${step.slug}`}

                  <li>
                    <a
                      {href}
                      aria-current={pathname === href}
                      class="fr-nav__link">
                      {step.title}
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
          </li>
          <li class="fr-nav__item">
            <a
              class="fr-nav__link"
              href="/revendre-mon-bien-en-brs"
              aria-current={pathname === '/revendre-mon-bien-en-brs'}
              target="_self">
              Revendre mon bien en BRS
            </a>
          </li>
          <li class="fr-nav__item">
            <a
              class="fr-nav__link"
              href="/blog"
              aria-current={pathname === '/blog'}
              target="_self">
              Le blog
            </a>
          </li>
          <li class="fr-nav__item">
            <a
              class="fr-nav__link"
              href="/notre-mission"
              aria-current={pathname === '/notre-mission'}
              target="_self">
              Notre mission
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</header>

<style lang="postcss">
  @media (--xxs-viewport) {
    .fr-header__operator {
      padding-inline: var(--5w);
    }
  }
</style>
