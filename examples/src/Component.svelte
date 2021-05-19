<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let name: string;

	let count = 0;

	function handleChangeCount(event) {
		count += 1;
		dispatch('someEvent', count);
	}
	function handleChangeName() {
		name = 'boss';
	}
</script>

<main>
	<h1>Hello {name}, welcome!</h1>
	<button on:click={handleChangeCount}>
		add count: {count}
	</button>
	<button on:click={handleChangeName}>
		update name: {name}
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
</style>