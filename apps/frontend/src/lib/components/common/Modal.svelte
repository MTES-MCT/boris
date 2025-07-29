<script lang="ts">
  import '@gouvfr/dsfr/dist/component/link/link.min.css';
  import '@gouvfr/dsfr/dist/component/button/button.min.css';
  import '@gouvfr/dsfr/dist/component/modal/modal.min.css';

  import { nanoid } from 'nanoid';
  import { onDestroy, onMount, type Snippet } from 'svelte';
  import { browser } from '$app/environment';

  type Props = {
    id?: string;
    autoOpen?: boolean;
    title: string;
    children: Snippet;
  };

  const {
    id = nanoid(10),
    autoOpen = false,
    title,
    children,
  }: Props = $props();

  let modalRef: HTMLElement | null = $state(null);
  let mutatedAttributes: string[] = $state([]);
  let isAutoOpen = $state(false);

  let observer: MutationObserver | null =
    browser && autoOpen
      ? new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutatedAttributes.push(mutation.attributeName ?? '');
          });
        })
      : null;

  onMount(() => {
    if (autoOpen) {
      modalRef = document.getElementById(id) as HTMLElement;

      observer?.observe(modalRef, {
        attributes: true,
      });
    }
  });

  onDestroy(() => {
    if (autoOpen) {
      observer?.disconnect();
    }
  });

  $effect(() => {
    if (
      mutatedAttributes.includes('data-fr-js-modal') &&
      mutatedAttributes.includes('class') &&
      mutatedAttributes.includes('aria-modal') &&
      modalRef &&
      !isAutoOpen
    ) {
      console.log('show modal here with autoopen');

      modalRef.classList.add('fr-modal--opened');
      modalRef.setAttribute('data-fr-js-modal', 'true');
      modalRef.setAttribute('aria-modal', 'true');
      modalRef.setAttribute('open', 'true');

      isAutoOpen = true;
    }
  });

  const closeModal = () => {
    modalRef?.classList.remove('fr-modal--opened');
    modalRef?.removeAttribute('data-fr-js-modal');
    modalRef?.removeAttribute('aria-modal');
    modalRef?.removeAttribute('open');
  };

  export { closeModal };
</script>

{#if !autoOpen}
  <button
    data-fr-opened="false"
    aria-controls={id}
    type="button"
    class="fr-btn">
    Ouvrir la modale
  </button>
{/if}

<dialog
  {id}
  class="fr-modal"
  aria-labelledby="modal-title"
  aria-modal="true">
  <div class="fr-container fr-container--fluid fr-container-md">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-col-md-10 fr-col-lg-6">
        <div
          class="fr-modal__body"
          data-fr-js-modal-body="true"
          style="--modal-max-height: 504px;">
          <div class="fr-modal__header">
            <button
              aria-controls={id}
              title="Fermer"
              type="button"
              class="fr-btn--close fr-btn"
              data-fr-js-modal-button="true"
              onclick={() => {
                if (autoOpen) {
                  closeModal();
                }
              }}>
              Fermer
            </button>
          </div>
          <div class="fr-modal__content">
            <h2
              id="modal-title"
              class="fr-modal__title">
              {title}
            </h2>
            {@render children()}
          </div>
        </div>
      </div>
    </div>
  </div>
</dialog>
