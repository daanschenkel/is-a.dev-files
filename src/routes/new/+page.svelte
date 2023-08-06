<script>
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import socket from '$lib/ws.js';
	import Fa from 'svelte-fa';
	import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
	import { Avatar } from '@skeletonlabs/skeleton';
	let file = {};
	let saving = false;
	let content = '';
	let items = [];
	let popup = {
		enabled: false
	};

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
			New File
		</h1>
	</div>
	<textarea class="textarea" rows="1" on:input={(e) => (content.filename = e.target.value)}></textarea>
	<br />
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
				socket.emit('saveFile', { file: content.filename, content: content.content });
			}}
		>
			{#if saving}
				Saving...
			{:else}
				Save
			{/if}
		</button>
</div>
