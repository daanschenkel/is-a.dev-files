<script>
	import { goto } from '$app/navigation';

	import { Avatar } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import socket from '$lib/ws.js';
	export let data;
	let domains = [];
	let domain;
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

		//socket stuff
		socket.emit('authenticate', data.jwt);
		socket.on('authenticated', () => {
			console.log('authenticated');
			socket.emit('getFiles');
		});
		socket.on('files', (data) => {
			items = data;
			console.log(data);
		});
		socket.on('domains', (data) => {
			domains = data;
		});
		socket.on('refresh', () => {
			window.location.reload();
		});
		socket.on('selectDomain', (data) => {
			if (data === false) {
				//remove domain from domains
				domains = domains.filter((item) => item.domain != domain);
				domain = undefined;
			}
		});
	});
</script>

<div class="container h-full mx-auto flex flex-col">
	<h1 class="text-4xl font-bold">
		{#if domain} {domain} {:else} File Explorer {/if}
	</h1>
	<br />
	<dl class="list-dl">
		{#if domains.length > 0 && items.length < 1}
			{#each domains as domainItem}
				<button
					class="btn variant-filled"
					on:click={() => {
						socket.emit('selectDomain', domainItem.domain);
						domain = domainItem.domain;
					}}
				>
					<span class="flex-auto">
						<dt class="font-bold">{domainItem.domain}</dt>
					</span>
				</button>
				<br />
			{/each}
		{/if}
		{#each items as item}
			{#if item.path == ''}
				<div
					class="cursor-pointer flex items-center justify-between"
					on:click={() => {
						goto(`${item.file}`);
					}}
				>
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
			{/if}
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
