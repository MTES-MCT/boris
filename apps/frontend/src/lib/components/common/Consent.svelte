<script lang="ts">
  import '@gouvfr/dsfr/dist/component/modal/modal.min.css';
  import '@gouvfr/dsfr/dist/component/consent/consent.min.css';

  import cookieConsentManager from '$lib/managers/consent.svelte';
  const handleAcceptAll = () => {
    cookieConsentManager.setUserConsent(true);
  };

  const handleRejectAll = () => {
    cookieConsentManager.setUserConsent(false);
  };
</script>

{#if cookieConsentManager.needsConsentDecision}
  <div class="fr-consent-banner fade-in">
    <h2 class="fr-h6">À propos des cookies sur BoRiS.</h2>
    <div class="fr-consent-banner__content">
      <p>
        Bienvenue ! Nous utilisons des cookies pour améliorer votre expérience
        et les services disponibles sur ce site. Pour en savoir plus, visitez la
        page <a
          href="/politique-de-confidentialite"
          class="fr-link">
          Données personnelles et cookies
        </a>
        . Vous pouvez, à tout moment, avoir le contrôle sur les cookies que vous
        souhaitez activer.
      </p>
    </div>
    <ul
      class="fr-consent-banner__buttons fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-sm">
      <li>
        <button
          class="fr-btn"
          title="Autoriser tous les cookies"
          onclick={handleAcceptAll}>
          Tout accepter
        </button>
      </li>
      <li>
        <button
          class="fr-btn fr-btn--secondary"
          title="Refuser tous les cookies"
          onclick={handleRejectAll}>
          Tout refuser
        </button>
      </li>
    </ul>
  </div>
{/if}
