<script lang="ts">
  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Section from '$components/common/Section.svelte';
  import Filters from '$components/pages/annuaire/Filters.svelte';
  import type { DataType } from './+page';
  import ListView from '$components/pages/annuaire/ListView.svelte';
  import annuaireManager from '$lib/managers/annuaire.svelte';
  import MapView from '$components/pages/annuaire/MapView.svelte';
  import { browser } from '$app/environment';

  type Props = {
    data: DataType;
  };

  const { data }: Props = $props();
</script>

<svelte:head>
  <title>Annuaire des sites de diffusion du BRS - BoRiS</title>
  <meta
    name="description"
    content="Annuaire des sites de diffusion du BRS" />
</svelte:head>

<GradientBackgroundWrapper>
  <Section
    title="Annuaire des sites de diffusion du BRS"
    titleElement="h1">
    <p>
      Chocolate cake oat cake gummi bears macaroon sugar plum. Muffin toffee
      gummies cookie muffin tart marzipan jujubes. Halvah lollipop chocolate
      cake chocolate dragée cake dessert topping sweet. Tootsie roll chocolate
      cake chocolate cake danish candy canes apple pie. Jelly beans dessert
      fruitcake candy canes jelly gummi bears. Cookie soufflé sugar plum
      shortbread macaroon. Sugar plum icing biscuit dragée gummies cotton candy
      macaroon pudding. Candy halvah tootsie roll jelly beans jelly chocolate
      cake macaroon halvah dessert. Macaroon cake jelly beans cake jelly-o
      marzipan.
    </p>
    <p>
      Chocolate cake biscuit powder sweet roll sweet. Muffin brownie candy canes
      pastry ice cream jelly-o cheesecake. Candy sweet pie lollipop candy canes
      sweet roll. Gummies lemon drops muffin gummies jujubes sweet roll dessert
      muffin candy. Jujubes jelly-o jelly biscuit cheesecake biscuit icing
      carrot cake danish. Jelly-o tiramisu sweet roll gummies tiramisu candy
      canes. Halvah lemon drops tootsie roll cookie brownie marshmallow sweet
      ice cream biscuit. Biscuit sweet sweet roll cake topping. Sweet roll
      liquorice chocolate danish danish.
    </p>
    <Filters />
  </Section>
  {#if annuaireManager.viewType === 'map'}
    <MapView brsDiffusionWebsites={data.mapBrsDiffusionWebsites} />
  {:else}
    <ListView />
  {/if}
</GradientBackgroundWrapper>
