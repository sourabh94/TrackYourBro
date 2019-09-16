const express = require("express");
const app = require("express")();
const Http = require("http").Server(app);
const Socketio = require("socket.io")(Http); 
const fs = require('fs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

//Auth packages
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const routes = require('./routes/index');
const userRoutes = require('./routes/users');

require('dotenv').config();

const sockFolder = 'socket';
const markers = [];

var users={};
var connections = [];

// parse application/json
app.use(bodyParser.json());                        

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static('public'));

var options = {
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'trackyourbro'
};

var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'YqKhTnnqzU',
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  //cookie: { secure: true }  //used for https
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);
app.use('/user', userRoutes);

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
		users[socket.username] = socket;
		//users.push(socket.username);
		updateUsernames();
	});
	function updateUsernames(){
		Socketio.emit("get users", Object.keys(users));
	}

	//send message
	socket.on("send message", data => {
		console.log(data);
		var msg = data.trim();
		if (msg.substr(0,3)==='/w '){
			msg = msg.substr(3);
			var i = msg.indexOf(' ');
			if(i !== -1){
				var name = msg.substr(0,i);
				var msg = msg.substr(i+1);
				users[name].emit("new message", {msg:msg, user:socket.username});
				users[socket.username].emit("new message", {msg:msg, user:socket.username});
				console.log('whisper!');
			}
		}
		else{
			Socketio.emit("new message", {msg:msg, user:socket.username});
		}
	}); 

	//Disconnect
	socket.on('disconnect', function(data){
		//if(!socket.username) return;
		delete users[socket.username];
		//users.splice(users.indexOf(socket),1);
		updateUsernames();

		connections.splice(connections.indexOf(socket),1);
		console.log('Disconneted : %s sockets connected', connections.length);	
	});
	
});

Http.listen(3000, ()=>{
	console.log("Listening at : 3000");
});

