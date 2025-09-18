<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import Select from '$components/common/Select.svelte';
  import annuaireManager from '$lib/managers/annuaire.svelte';
  import { defaultRadius } from '$lib/utils/constants';

  const radiuses = ['2', '5', '10', '20'];

  let value = $state<string>(defaultRadius.toString());

  $effect(() => {
    annuaireManager.radius = Number(value);
  });

  const generateSelecOptions = (): ComponentProps<typeof Select>['options'] => {
    const selectOptions: ComponentProps<typeof Select>['options'] = [];

    radiuses.forEach((radius) => {
      selectOptions.push({
        value: radius,
        label: `${radius} km`,
        selected:
          annuaireManager.viewType === 'map'
            ? radius === annuaireManager.radius.toString()
            : radius === value,
      });
    });

    return selectOptions;
  };

  let options = $derived(generateSelecOptions());

  const handleSelect = (e: Event) => {
    const target = e.target as HTMLSelectElement;

    value = target.value;

    annuaireManager.setListBrsDiffusionWebsites({
      radius: Number(value),
    });
  };
</script>

<Select
  id="rayon"
  label="Rayon (km)"
  disabled={annuaireManager.viewType === 'map'}
  {options}
  onChange={handleSelect} />
