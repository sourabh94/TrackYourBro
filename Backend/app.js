const express = require("express");
const app = require("express")();
const Http = require("http").Server(app);
const Socketio = require("socket.io")(Http);
var fs = require('fs');

const sockFolder = 'socket';
const markers = [];

var users=[];
var connections = [];

app.use(express.static('public'));

// const files = fs.readdirSync(sockFolder).forEach(file => {
//   		console.log(file);
//   		eval(fs.readFileSync(sockFolder+'/'+file)+'');
// });


Socketio.on("connection", socket =>{
	//initiating all markers
	for( let i = 0 ; i < markers.length ; i++ ){
		socket.emit("marker", markers[i]);
	}
	
	//Calling all modules
	const files = fs.readdirSync(sockFolder).forEach(file => {
  		console.log(file);
  		eval(fs.readFileSync(sockFolder+'/'+file)+'');
	});
	
	eval(files);

	//connections
	connections.push(socket);
	console.log('Conneted : %s sockets connected', connections.length);
	
	//new user only for testing 
	socket.on('new user',function(data,callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});
	function updateUsernames(){
		Socketio.emit("get users", users);
	}

	//Disconnect
	socket.on('disconnect', function(data){
		//if(!socket.username) return;
		users.splice(users.indexOf(socket),1);
		updateUsernames();

		connections.splice(connections.indexOf(socket),1);
		console.log('Disconneted : %s sockets connected', connections.length);	
	});
	
});

Http.listen(3000, ()=>{
	console.log("Listening at : 3000");
});

app.get('/', (req,res) => {
  res.sendFile(__dirname+'/public/index.html');
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
