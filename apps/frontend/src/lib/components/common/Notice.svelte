<script lang="ts">
  import '@gouvfr/dsfr/dist/component/notice/notice.min.css';

  type Props = {
    content: string;
    type?:
      | 'info'
      | 'warning'
      | 'caution'
      | 'alert'
      | 'weather-orange'
      | 'weather-red'
      | 'weather-purple'
      | 'kidnapping'
      | 'cyberattack'
      | 'attack'
      | 'witness';
  };

  const { content, type }: Props = $props();
</script>

<div class={`fr-notice ${type ? `fr-notice--${type}` : ''}`}>
  <div class="fr-container">
    <div class="fr-notice__body">
      <p>
        {#if !type}
          <span class="fr-icon-information-fill fr-notice__icon"></span>
        {:else if type === 'caution'}
          <span class="fr-icon-information-line fr-notice__icon"></span>
        {/if}
        <span class="fr-notice__title">{content}</span>
      </p>
    </div>
  </div>
</div>

<style lang="postcss">
  .fr-notice--none {
    background-color: transparent;
  }

  .fr-notice--caution {
    color: var(--text-label-pink-tuile);
    background-color: var(--background-contrast-pink-tuile);
  }
</style>
