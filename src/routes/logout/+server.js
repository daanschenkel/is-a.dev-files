import { redirect } from '@sveltejs/kit';
import { logout } from '$lib/auth.js';
export function GET({ cookies }) {
	throw redirect(303, logout(cookies));
}
