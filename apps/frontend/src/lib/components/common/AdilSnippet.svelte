<script lang="ts">
  import cookieConsentManager from '$lib/managers/consent.svelte';

  const handleClick = () => {
    if (cookieConsentManager.hasUserConsented) {
      // @ts-expect-error - gtag is not defined in the global scope
      window.gtag('event', 'click', {
        event_category: 'adil',
        event_label: 'contact_adil',
      });
    }
  };
</script>

<div class="mb-8">
  <p class="fr-text--sm">
    Besoin de plus d'information? Prenez rendez-vous avec un·e conseiller·e
    juriste de votre Agence Départementale d'Information sur le Logement (ADIL).
    L'ADIL exerce une mission d'intérêt général et propose ses services
    gratuitement.
  </p>

  <a
    href="https://www.anil.org/lanil-et-les-adil/votre-adil/"
    class="fr-btn fr-btn--sm"
    target="_blank"
    rel="noopener noreferrer"
    onclick={handleClick}>
    Je prends contact !
  </a>
</div>
