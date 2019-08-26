socket.on("send message", data => {
	console.log(data);
	Socketio.emit("new message", {msg:data, user:socket.username});
}); 


