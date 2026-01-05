<script lang="ts">
  import '@gouvfr/dsfr/dist/component/notice/notice.min.css';

  type Props = {
    content: string;
    type?:
      | 'info'
      | 'warning'
      | 'alert'
      | 'weather-orange'
      | 'weather-red'
      | 'weather-purple'
      | 'kidnapping'
      | 'cyberattack'
      | 'attack'
      | 'witness';
    hasDescription?: boolean;
    desc?: string;
    hasLink?: boolean;
    linkLabel?: string;
    linkHref?: string;
    linkTitle?: string;
    blank?: boolean;
    dismissible?: boolean;
    buttonLabel?: string;
    dismissableAction?: () => void;
  };

  const {
    content,
    type,
    hasDescription,
    desc,
    hasLink,
    linkLabel,
    linkHref,
    linkTitle,
    blank,
    dismissible,
    buttonLabel,
  }: Props = $props();

  let dismissButtonRef = $state<null | HTMLButtonElement>(null);

  const dismiss = () => {
    if (dismissButtonRef) {
      const notice = dismissButtonRef.parentNode?.parentNode?.parentNode;
      notice?.parentNode?.removeChild(notice);
    }
  };
</script>

<div class={`fr-notice ${type ? `fr-notice--${type}` : ''}`}>
  <div class="fr-container">
    <div class="fr-notice__body">
      <p>
        {#if !type}
          <span class="fr-icon-information-fill fr-notice__icon"></span>
        {/if}

        <span class="fr-notice__title">{content}</span>

        {#if hasDescription}
          <span class="fr-notice__desc">{desc}</span>
        {/if}

        {#if hasLink}
          <a
            href={linkHref}
            target={blank ? '_blank' : '_self'}
            title={linkTitle}
            class="fr-notice__link">
            {linkLabel}
          </a>
        {/if}
      </p>

      {#if dismissible}
        <button
          bind:this={dismissButtonRef}
          onclick={dismiss}
          title="Masquer le message"
          type="button"
          class="fr-btn--close fr-btn">
          {buttonLabel}
        </button>
      {/if}
    </div>
  </div>
</div>
