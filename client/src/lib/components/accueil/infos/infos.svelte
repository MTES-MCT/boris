<script>
  import HorizontalCard from '$components/cards/horizontal/horizontal.svelte';
  import Section from '$components/section/section.svelte';
  import heroSrc from '$assets/images/home-hero.jpg';
</script>

<Section>
  <HorizontalCard
    title="Accédez à une information qualifiée."
    content="Le Bail Réel Solidaire (BRS) est un dispositif permettant à des ménages ne pouvant plus acheter dans le marché libre de devenir propriétaire. Il dispose de nombreux avantages mais aussi beaucoup de particularités à connaître. BoRiS vous propose des renseignements officiels et travaillés de sorte à rendre la propriété accessibles pour tous·tes."
    href="/tout-savoir-sur-le-BRS"
    imgSrc={heroSrc}
    linkLabel="Découvrir le BRS et débuter mon parcours " />
</Section>
