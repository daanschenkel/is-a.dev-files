<script>
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';

	import { AppShell, AppBar, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	let page;
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">is-a.dev</svelte:fragment>

			<svelte:fragment slot="trail">
				<a href="/logout" class="btn variant-filled-error"> Logout </a></svelte:fragment
			>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft"
		><ListBox>
			<ListBoxItem bind:group={page} name="medium" value="books">Books</ListBoxItem>
			<ListBoxItem bind:group={page} name="medium" value="movies">Movies</ListBoxItem>
			<ListBoxItem bind:group={page} name="medium" value="tv">TV</ListBoxItem>
		</ListBox></svelte:fragment
	>
	<!-- (sidebarRight) -->
	<!-- (pageHeader) -->
	<!-- Router Slot -->
	<slot />
	<!-- ---- / ---- -->
	<!-- <svelte:fragment slot="pageFooter">Page Footer</svelte:fragment> -->
	<!-- (footer) -->
</AppShell>
