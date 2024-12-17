<script lang="ts">
  import { page } from '$app/stores';
  import { default as Logo } from '$assets/illustrations/logo.svg?raw';

  let pathname = $state($page.url.pathname);

  $effect(() => {
    pathname = $page.url.pathname;
  });
</script>

<header
  role="banner"
  class="fr-header">
  <div class="fr-header__body">
    <div class="fr-container">
      <div class="fr-header__body-row">
        <div class="fr-header__brand fr-enlarge-link">
          <div class="fr-header__brand-top">
            <div class="fr-header__logo">
              <p class="fr-logo">
                Ministère <br />
                du logement
                <br />
                et de la rénovation
                <br />
                urbaine
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
              title="Accueil - Boris - Ministère du logement et de la rénovation urbaine">
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
              href="/organismes-fonciers-solidaires"
              aria-current={pathname === '/organismes-fonciers-solidaires'}
              target="_self">
              La liste des OFS
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
                <li>
                  <a
                    href="/tout-savoir-sur-le-bail-reel-solidaire-brs/je-decouvre-le-dispositif"
                    aria-current={pathname ===
                      '/tout-savoir-sur-le-bail-reel-solidaire-brs/je-decouvre-le-dispositif'}
                    class="fr-nav__link">
                    Je découvre le dispositif
                  </a>
                </li>
                <li>
                  <a
                    href="/tout-savoir-sur-le-bail-reel-solidaire-brs/je-trouve-mon-logement"
                    aria-current={pathname ===
                      '/tout-savoir-sur-le-bail-reel-solidaire-brs/je-trouve-mon-logement'}
                    class="fr-nav__link">
                    Je trouve mon logement en BRS
                  </a>
                </li>
                <li>
                  <a
                    href="/tout-savoir-sur-le-bail-reel-solidaire-brs/je-cherche-des-financements"
                    aria-current={pathname ===
                      '/tout-savoir-sur-le-bail-reel-solidaire-brs/je-cherche-des-financements'}
                    class="fr-nav__link">
                    Je cherche des financements
                  </a>
                </li>
                <li>
                  <a
                    href="/tout-savoir-sur-le-bail-reel-solidaire-brs/je-deviens-proprietaire"
                    aria-current={pathname ===
                      '/tout-savoir-sur-le-bail-reel-solidaire-brs/je-deviens-proprietaire'}
                    class="fr-nav__link">
                    Je deviens propriétaire
                  </a>
                </li>
                <li>
                  <a
                    href="/tout-savoir-sur-le-bail-reel-solidaire-brs/je-suis-chez-moi"
                    aria-current={pathname ===
                      '/tout-savoir-sur-le-bail-reel-solidaire-brs/je-suis-chez-moi'}
                    class="fr-nav__link">
                    Je suis chez moi
                  </a>
                </li>
              </ul>
            </div>
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
