<script lang="ts">
  import Section from '$components/common/Section.svelte';
  import { contactEmail } from '$lib/utils/constants';
</script>

<svelte:head>
  <title>Nous contacter - Boris</title>
  <meta
    name="description"
    content="Contactez-nous pour toute question concernant le Bail Réel Solidaire (BRS) et obtenez de l'aide pour votre parcours vers l'achat d'un logement." />
</svelte:head>

<Section
  title="Nous contacter"
  titleElement="h1">
  <p>
    Si vous avez des questions concernant le BRS, vous pouvez nous contacter à
    l'adresse courriel suivante: <a
      class="fr-link"
      href={`mailto:${contactEmail}`}>
      {contactEmail}
    </a>
  </p>
  <p>
    Nous faisons de notre mieux pour vous répondre dans les meilleurs délais.
  </p>
</Section>
