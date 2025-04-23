<script lang="ts">
  import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css';

  type Props = {
    title: string;
    label: string;
    href: string;
  };

  const { title, label, href }: Props = $props();
</script>

<a
  class="fr-link"
  {href}>
  <div>
    <p class="fr-text--xs fr-mb-0">
      <b>{label}</b>
    </p>

    <p class="fr-mb-0">
      <b>{title}</b>
    </p>
  </div>

  <span
    class={`fr-icon-arrow-${label === 'Étape précédente' ? 'left' : 'right'}-line`}
    aria-hidden="true">
  </span>
</a>

<style lang="postcss">
  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--3w);
    background: none;
  }

  @media (--sm-viewport) {
    [class^='fr-icon-arrow-'] {
      display: none;
    }
  }
</style>
