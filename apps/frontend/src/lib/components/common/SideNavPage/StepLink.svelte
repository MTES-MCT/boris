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
  class="fr-link flex align-center justify-between background-none"
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
    class="fr-icon block sm_none"
    class:fr-icon-arrow-left-line={label === 'Étape précédente'}
    class:fr-icon-arrow-right-line={label === 'Étape suivante'}
    aria-hidden="true">
  </span>
</a>
