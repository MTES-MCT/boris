<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import Select from '$components/common/Select.svelte';
  import annuaireManager from '$lib/managers/annuaire.svelte';

  const radiuses = ['5', '10', '20', '50', '100', '200'];

  let value = $state<string>('50');

  const generateSelecOptions = (): ComponentProps<typeof Select>['options'] => {
    const selectOptions: ComponentProps<typeof Select>['options'] = [];

    radiuses.forEach((radius) => {
      selectOptions.push({
        value: radius,
        label: `${radius} km`,
        selected: radius === value,
      });
    });

    return selectOptions;
  };

  let options = $derived(generateSelecOptions());

  const handleSelect = (e: Event) => {
    const target = e.target as HTMLSelectElement;

    value = target.value;

    annuaireManager.setBrsDiffusionWebsites({
      radius: Number(value),
    });
  };
</script>

<Select
  id="rayon"
  label="Rayon (km)"
  {options}
  onChange={handleSelect} />
