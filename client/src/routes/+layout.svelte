<script lang="ts">
	import '@gouvfr/dsfr/dist/dsfr.main.min.css';

	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

{@render children()}
