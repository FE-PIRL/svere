<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let name: string;

	let count = 0;

	function handleClick(event) {
		count += 1;
		name = 'yasin';
		dispatch('someEvent', count);
	}
</script>

<main>
	<h1>Hello {name}!</h1>
	<button on:click={handleClick}>
		count: {count}
	</button>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>