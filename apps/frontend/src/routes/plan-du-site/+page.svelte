<script lang="ts">
  import Section from '$components/common/Section.svelte';
  import { articles } from '$routes/blog/articles';
  import { steps } from '$routes/tout-savoir-sur-le-bail-reel-solidaire-brs/[slug]/content';

  const sections = [
    {
      title: 'Les simulateurs et les logements',
      links: [
        {
          href: '/simulateur-eligibilite',
          label: 'Simulateur d’éligibilité au BRS',
        },
        {
          href: '/simulateur-eligibilite/steps',
          label: 'Commencer une simulation d’éligibilité',
        },
        {
          href: '/simulateur-acquisition',
          label: 'Simulateur de coût d’acquisition en BRS',
        },
        {
          href: '/logements-brs-disponibles',
          label: 'Trouver un logement en BRS',
        },
      ],
    },
    {
      title: 'Comprendre le bail réel solidaire',
      links: [
        {
          href: '/tout-savoir-sur-le-bail-reel-solidaire-brs',
          label: 'Tout savoir sur le bail réel solidaire',
        },
        ...steps.map((step) => ({
          href: `/tout-savoir-sur-le-bail-reel-solidaire-brs/${step.slug}`,
          label: step.title,
        })),
        {
          href: '/organismes-de-foncier-solidaire',
          label: 'Les organismes de foncier solidaire (OFS)',
        },
        {
          href: '/revendre-mon-bien-en-brs',
          label: 'Revendre mon bien en BRS',
        },
      ],
    },
    {
      title: 'Les partenaires du financement',
      links: [
        { href: '/action-logement', label: 'Action Logement' },
        { href: '/groupe-csf', label: 'Groupe CSF' },
        { href: '/groupe-la-poste', label: 'Groupe La Poste' },
      ],
    },
    {
      title: 'Le blog',
      links: [
        { href: '/blog', label: 'Tous les articles du blog' },
        ...articles.map((article) => ({
          href: `/blog/${article.slug}`,
          label: article.pageTitle || article.title,
        })),
      ],
    },
    {
      title: 'Le service BoRiS',
      links: [
        { href: '/notre-mission', label: 'Notre mission' },
        { href: '/nous-contacter', label: 'Nous contacter' },
        { href: '/statistiques', label: 'Statistiques' },
        { href: '/matrice-impact', label: 'Matrice d’impact' },
        { href: '/espace-presse', label: 'Espace presse' },
        { href: '/questionnaire', label: 'Questionnaire' },
      ],
    },
    {
      title: 'Informations légales et accessibilité',
      links: [
        { href: '/accessibilite', label: 'Déclaration d’accessibilité' },
        { href: '/mentions-legales', label: 'Mentions légales' },
        {
          href: '/conditions-generales-d-utilisation',
          label: 'Conditions générales d’utilisation',
        },
        {
          href: '/politique-de-confidentialite',
          label: 'Politique de confidentialité',
        },
      ],
    },
  ];
</script>

<svelte:head>
  <title>Plan du site - BoRiS</title>
  <meta
    name="description"
    content="Retrouvez les pages, les simulateurs et les articles du site BoRiS." />
</svelte:head>

<Section
  title="Plan du site"
  titleElement="h1">
  <p>
    <a
      href="/"
      class="fr-link">
      Accueil de BoRiS
    </a>
  </p>
  {#each sections as section}
    <h2 class="fr-mt-6w">{section.title}</h2>
    <ul>
      {#each section.links as link}
        <li>
          <a
            href={link.href}
            class="fr-link">
            {link.label}
          </a>
        </li>
      {/each}
    </ul>
  {/each}
</Section>
