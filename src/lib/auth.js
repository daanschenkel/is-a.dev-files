import { env } from '$env/dynamic/private';
import { env as envpub } from '$env/dynamic/public';
import jsonwebtoken from 'jsonwebtoken';
const { verify } = jsonwebtoken;
function authURL(currentURL) {
	let url = `${envpub.PUBLIC_MANAGE_URL}/login/authorize?next=${encodeURIComponent(
		currentURL
	)}&provider=files`;
	return url;
}
export function getJWT(jwt) {
	//verify the jwt
	let response = verify(jwt, env.SECRET_KEY, (err, response) => {
		if (err) {
			return null;
		}
		return response;
	});
	return response || null;
}
function serverAuth({ cookies, url }) {
	if (url.searchParams.has('jwt')) {
		cookies.set('jwt', url.searchParams.get('jwt'));
		return {
			redirect: url.pathname
		};
	}
	let auth = getJWT(cookies.get('jwt'));
	console.log(auth);
	if (!auth)
		return {
			redirect: authURL(url.href)
		};
	return {
		auth
	};
}
function logout(cookies) {
	cookies.set('jwt', '');
	return `${envpub.PUBLIC_MANAGE_URL}/login/out`;
}
export { logout };

export { authURL, serverAuth };
