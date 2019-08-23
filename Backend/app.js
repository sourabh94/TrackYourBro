const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);


const markers = [];


Socketio.on("connection", socket =>{
	for(let i = 0 ;i < markers.length; i++ ){
		socket.emit("marker", markers[i]);
	}
	socket.on("marker", data => {
		markers.push(data);
		Socketio.emit("marker", data);
	});
});

Http.listen(3000, ()=>{
	console.log("Listening at : 3000");
});

Express.get('/', (req,res) => {
  res.sendFile(__dirname+'/public/index.html');
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
