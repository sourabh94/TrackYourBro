const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);
var fs = require('fs');

const sockFolder = 'socket';
const markers = [];


Socketio.on("connection", socket =>{
	for( let i = 0 ; i < markers.length ; i++ ){
		socket.emit("marker", markers[i]);
	}
	
	fs.readdirSync(sockFolder).forEach(file => {
  		console.log(file);
  		eval(fs.readFileSync(sockFolder+'/'+file)+'');
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
