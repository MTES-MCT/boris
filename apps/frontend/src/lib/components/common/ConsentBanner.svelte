<script lang="ts">
  import cookieConsentManager from '$lib/managers/consent.svelte';
  import Modal from '$lib/components/common/Modal.svelte';

  const { setUserConsent, needsConsentDecision } = cookieConsentManager;

  let modalRef: Modal;

  const handleAcceptAll = () => {
    setUserConsent(true);
    modalRef?.closeModal();
  };

  const handleRejectAll = () => {
    setUserConsent(false);
    modalRef?.closeModal();
  };
</script>

{#if needsConsentDecision}
  <Modal
    bind:this={modalRef}
    title="À propos des cookies sur BoRiS"
    autoOpen>
    <div class="fr-consent-banner">
      <div class="fr-consent-banner__content">
        <p class="fr-text--sm">
          Bienvenue ! Nous utilisons des cookies pour améliorer votre expérience
          et les services disponibles sur ce site. Pour en savoir plus, visitez
          la page <a href="/politique-de-confidentialite">
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
            on:click={handleAcceptAll}>
            Tout accepter
          </button>
        </li>
        <li>
          <button
            class="fr-btn fr-btn--secondary"
            title="Refuser tous les cookies"
            on:click={handleRejectAll}>
            Tout refuser
          </button>
        </li>
      </ul>
    </div>
  </Modal>
{/if}
