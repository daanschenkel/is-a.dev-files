import { io } from 'socket.io-client';
import { env } from '$env/dynamic/public';
const socket = io(env.PUBLIC_WS_URL);
export default socket;
