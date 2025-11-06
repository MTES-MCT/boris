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
  class="fr-link !flex items-center justify-between gap-6 !bg-none"
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
    class={`fr-icon-arrow-${label === 'Étape précédente' ? 'left' : 'right'}-line md:hidden`}
    aria-hidden="true">
  </span>
</a>
