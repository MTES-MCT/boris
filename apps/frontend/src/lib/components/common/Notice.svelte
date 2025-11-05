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
  };

  const { content, type }: Props = $props();
</script>

<div class={`fr-notice ${type ? `fr-notice--${type}` : ''}`}>
  <div class="fr-container">
    <div class="fr-notice__body">
      <p>
        {#if !type}
          <span class="fr-icon-information-fill fr-notice__icon"></span>
        {/if}
        <span class="fr-notice__title">{content}</span>
      </p>
    </div>
  </div>
</div>
