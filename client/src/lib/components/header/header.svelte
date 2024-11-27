<script lang="ts">
  import { default as Logo } from '$assets/illustrations/logo.svg?raw';
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
        id="navigation-494"
        role="navigation"
        aria-label="Menu principal">
        <ul class="fr-nav__list">
          <li class="fr-nav__item">
            <a
              class="fr-nav__link"
              href="/simuler-mon-eligibilite"
              target="_self">
              Le simulateur BoRiS
            </a>
          </li>
          <li class="fr-nav__item">
            <a
              class="fr-nav__link"
              href="/organismes-fonciers-solidaires"
              target="_self">
              La liste des OFS
            </a>
          </li>
          <li class="fr-nav__item">
            <a
              class="fr-nav__link"
              href="/tout-savoir-sur-le-BRS"
              target="_self">
              Qu'est ce que le BRS ?
            </a>
          </li>
          <li class="fr-nav__item">
            <a
              class="fr-nav__link"
              href="/blog"
              target="_self">
              Le blog
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</header>
