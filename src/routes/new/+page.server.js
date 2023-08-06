import { redirect } from '@sveltejs/kit';
import { serverAuth } from '$lib/auth.js';
export function load({ cookies, url, params }) {
	let auth = serverAuth({ cookies, url });
	if (auth.redirect) throw redirect(303, auth.redirect);
	console.log(params);
	return {
		auth,
		jwt: cookies.get('jwt'),
		file: params.file
	};
}
