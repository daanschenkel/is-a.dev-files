<script>
	import { Avatar } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import socket from '$lib/ws.js';
	let popup = {
		enabled: false
	};
	let items = [];
	onMount(() => {
		//on click outside popup
		document.addEventListener('click', (e) => {
			if (e.target.id != 'popup-button' && e.target.id != 'popup') {
				popup.enabled = false;
			}
		});
	});
	socket.on('authenticated', () => {
		console.log('authenticated');
		socket.emit('getFiles');
	});
	socket.on('files', (data) => {
		items = data;
		console.log(data);
	});
</script>

<div class="container h-full mx-auto flex flex-col">
	<h1 class="text-4xl font-bold">File Explorer</h1>
	<br />
	<dl class="list-dl">
		{#each items as item}
			<div>
				<Avatar
					class="mr-4"
					width="w-8"
					height="h-8"
					src={`https://raw.githubusercontent.com/LeonardSSH/vscord/main/assets/icons/${
						item.file.split('.')[1]
					}.png`}
					fallback={`https://raw.githubusercontent.com/LeonardSSH/vscord/main/assets/icons/text.png`}
					initials={item.file.split('.')[1]}
				/>
				<span class="flex-auto">
					<dt class="font-bold">{item.file}</dt>
					<dd class="text-sm opacity-50">{item.type}</dd>
				</span>
				<button
					class="btn variant-filled-primary"
					id="popup-button"
					on:click={(event) => {
						popup.enabled = false;
						//center popup under button
						popup.left = event.target.offsetLeft;
						popup.top = event.target.offsetTop + event.target.offsetHeight;

						setTimeout(() => {
							popup.enabled = true;
						}, 50);
					}}>⋮</button
				>
			</div>
		{/each}
	</dl>
</div>

{#if popup.enabled}
	<div
		class="card p-4 w-72 shadow-xl fixed"
		style="left: {popup.left}px; top: {popup.top}px;"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
		id="popup"
	>
		<div><p>✎Edit</p></div>
		<div><p>🗑Delete</p></div>
		<div class="arrow bg-surface-100-800-token" />
	</div>
{/if}
