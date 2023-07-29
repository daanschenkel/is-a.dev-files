import { redirect } from '@sveltejs/kit';
import { serverAuth } from '../lib/auth.js';
export function load({ cookies, url }) {
	let auth = serverAuth({ cookies, url });
	if (auth.redirect) throw redirect(303, auth.redirect);
	return {
		auth,
		jwt: cookies.get('jwt')
	};
}
