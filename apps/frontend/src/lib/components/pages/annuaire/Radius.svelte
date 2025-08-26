<script lang="ts">
  import Select from '$components/common/Select.svelte';
  import type { ComponentProps } from 'svelte';

  const radiuses = ['5', '10', '20', '50', '100'];

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
  };

  $inspect(value);
</script>

<Select
  id="rayon"
  label="Rayon (km)"
  {options}
  onChange={handleSelect} />
