/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');
var uuid = require('node-uuid');

// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {
    console.log("CONNECTED TO SOCKET!!!");
    // When the client emits 'info', this listens and executes
    socket.on('info', function (data) {
        console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
    });

    // Insert sockets below
    //require('../api/song/song.socket').register(socket);
}

var rooms = {};
var users = {};

module.exports = function (socketio, app) {

	function User(socket, name) {
		this.socket = socket;
		this.id = socket.id;
		this.name = name;
	}
	
    function Room(roomName, owner) {
		this.roomName = roomName;
        this.owner = owner;
        this.uid = uuid.v4();

        this.owner.socket.join(this.uid);

        this.clients = [];
        this.clients.push(owner);

        this.getUid = function () {
            return this.uid;
        }

        this.addClient = function (user) {
			if (this.clients[user.name])
				return;
            user.socket.join(this.uid);
            this.clients[user.name] = user;
        }

        this.removeClient = function(user) {
			if (!this.clients[user.name])
				return;
			this.clients[user.name] = null;
			socketio.leave(this.uid);
		}

        this.emit = function (eventName, data) {
			var userNames = "";
			for (var index in this.clients)
				userNames += (this.clients[index].name + ", ");
            console.log("number of clients: " + this.clients.length + ", message type: " + eventName + ", destined to: " + userNames);
            socketio.to(this.uid).emit(eventName, data);
        }

        this.clientDisconnected = function(socketId) {
			for (var index in this.clients) {
				if (this.clients[index].id === socketId) {
					this.clients = removeArrayElement(this.clients, index);
					return;
				}
			}
		}	
    }

	function logMessage(eventName, data) {
		console.info("Received " + eventName + "\n" + JSON.stringify(data));
	}
	
	function getUser(userName, socket) {
		console.log("Get user named " + userName);
		if (users[userName]) {
			console.log("Found user " + userName + ": " + socket.id);
			if (socket.id != users[userName].socket.id)
				return null;
			console.log("Returning user " + userName + ": " + socket.id);
			return users[userName];
		}
		var user = new User(socket, userName);
		users[userName] = user;
		console.log("Returning new user " + userName + ": " + socket.id);
		return user;
	}
	
	function removeArrayElement(array, key) {
		var newArray = [];
		for (var tag in array)
			if (tag !== key)
				newArray[tag] = array[tag];
		return newArray;
	}
	
    // socket.io (v1.x.x) is powered by debug.
    // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
    //
    // ex: DEBUG: "http*,socket.io:socket"

    // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
    //
    // 1. You will need to send the token in `client/components/socket/socket.service.js`
    //
    // 2. Require authentication here:

//     socketio.use(require('socketio-jwt').authorize({
//         secret: config.secrets.session,
//         handshake: true
//     }));

    var theSocket;
	
    socketio.on('connection', function (socket) {

        socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

        socket.on('room.create',function(data) {
			logMessage('room.create', data);
			var user = getUser(data.user, socket);
			if (!user) {
				socket.emit('user.error', {"message": "User already exists"});
				return;
			}
            var room = new Room(data.roomName, user);
            var roomId = room.getUid();
            rooms[roomId] = room;
            socket.emit('room.created', {'roomId': roomId });
        });

        socket.on('room.join', function (data) {
			logMessage('room.join', data);
			var user = getUser(data.user, socket);
			if (!user) {
				socket.emit('user.error', {"message": "User already exists"});
				return;
			}
            rooms[data.roomId].addClient(user);
			socket.emit('room.joined',{'roomId': data.roomId, 'user': user.name });
        });
		
		socket.on('room.leave', function(data) {
			logMessage('room.leave', data);
			var user = getUser(data.user, socket);
			if (!user) {
				socket.emit('user.error', {"message": "User already exists"});
				return;
			}
			rooms[data.roomId].removeClient(user);
			socket.emit('room.left',{'roomId': data.roomId, 'user': user.name });
		});

        socket.on('message', function (data) {
			logMessage('message', data);
            var roomId = data.roomId;
			var user = getUser(data.user, socket);
			if (!user) {
				socket.emit('user.error', {"message": "User already exists"});
				return;
			}
            rooms[roomId].emit('message', data);
        });

        socket.on('disconnect', function () {
			for (var userName in users) {
				if (users[userName].socket.id === socket.id)
					users[userName] = null;
			}
			for (var roomId in rooms) {
				rooms[roomId].clientDisconnected(socket.id);
			}
        });
		
		socket.on('users.list', function(data) {
			var userList = (data.room) ? rooms[data.room].clients : users;
			var data = [];
			for (var tag in userList) {
				var user = userList[userName];
				data.push({
					"id": user.id,
					"name": user.name
				});
			}
			socket.emit('users.listed', data);
		});
		
		socket.on('rooms.list', function(data) {
			var data = [];
			var userName = data.user;
			for (var roomId in rooms) {
				var room = rooms[roomId];
				if (!(userName) || room.clients[userName]) {
					data.push({
						"roomId": roomId,
						"name": room.name
					});
				}
			}
			socket.emit('rooms.listed', data);
		});

        theSocket = socket;


        // Call onConnect.
        onConnect(socket);
        console.info('[%s] CONNECTED', socket.address);
    });

    app.use(function (req, res, next) {

        req.socketio = function () {

            if (theSocket) {
                return theSocket;
            }

            console.log("SOCKET IS NOT CREATED!");

            return {
                emit: function () {
                },
                on: function () {
                }
            };
        };

        next();
    });
};