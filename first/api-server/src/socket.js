import { Server } from 'socket.io';
let io;
export function initSocket(server){
io = new Server(server, {cors:{origin:'*'}});
io.on('connection', socket=>{
console.log('client connected');
});
}
export { io };