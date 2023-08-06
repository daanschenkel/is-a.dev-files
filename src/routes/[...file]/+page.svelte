<script>
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import socket from '$lib/ws.js';
	import Fa from 'svelte-fa';
	import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
	import { Avatar } from '@skeletonlabs/skeleton';
	export let data;
	console.log(data);
	let saving = false;
	let content = '';
	let items = [];
	let popup = {
		enabled: false
	};
	socket.emit('getFile', data.file);

	onMount(() => {
		//on click outside popup
		document.addEventListener('click', (e) => {
			if (e.target.id != 'popup-button' && e.target.id != 'popup') {
				popup.enabled = false;
			}
		});
		//socket stuff
		socket.on('connect', () => {
			goto('/'); //redirect to login page
		});
		socket.on('file', (data) => {
			content = data;
		});
		socket.on('refresh', () => {
			goto('/'); //redirect to login page
		});
		socket.on('saveFile', (data) => {
			if (data) saving = false;
			else {
				alert('Error saving file');
				saving = false;
			}
		});
		socket.on('files', (files) => {
			let toadd = [];
			files.forEach((item) => {
				if (`${item.path}` === `/${data.file}`) toadd = [...toadd, item];
			});
			items = toadd;
		});
	});

	console.log(content);
</script>

<div class="container h-full mx-auto flex flex-col">
	<div>
		<a href="../" class="btn variant-filled">
			<Fa icon={faLeftLong} />
		</a>
		<h1 class="text-4xl font-bold">
			{data.file}
		</h1>
	</div>
	<br />
	{#if content.type === 'file'}
		<textarea
			class="textarea"
			rows="20"
			on:input={(e) => {
				content.content = e.target.value;
			}}>{content.content}</textarea
		>
		<br />
		<button
			class="btn variant-filled-success"
			on:click={() => {
				if (saving) return;
				saving = true;
				socket.emit('saveFile', { file: data.file, content: content.content });
			}}
		>
			{#if saving}
				Saving...
			{:else}
				Save
			{/if}
		</button>
	{/if}
	{#if content.type === 'directory'}
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
	{/if}
</div>
