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

module.exports = function (socketio, app) {

    function Room(owner) {
        this.owner = owner;
        this.uid = uuid.v4();

        owner.join(this.uid);

        this.clients = [];
        this.clients.push(owner);

        this.getUid = function () {
            return this.uid;
        }

        this.addClient = function (socket) {
            socket.join(this.uid);
            this.clients.push(socket);
        }

        this.emit = function (eventName, data) {
            console.log("number of clients", this.clients.length);
            socketio.to(this.uid).emit(eventName, data);
        }
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

    socketio.use(require('socketio-jwt').authorize({
        secret: config.secrets.session,
        handshake: true
    }));

    var theSocket;

    socketio.on('connection', function (socket) {

        socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

        socket.on('room.create',function() {

            // Create room
            var room = new Room(socket);

            // Generate room id and save it
            var roomId = room.getUid();
            rooms[roomId] = room;

            // Send back the room
            socket.emit('room.created', {'roomId': roomId });

        });

        socket.on('room.join', function (data) {

            console.log('Adding client to room ',  data.roomId);
            rooms[data.roomId].addClient(socket);

            console.log("new rooms array");
            console.log(rooms);
			
			var roomId = data.roomId;
			socket.emit('room.joined',{'roomId': roomId });

        });

        socket.on('message', function (data) {
            var roomId = data.roomId;
            rooms[roomId].emit(data);
            console.log('Got message that should be sent to ', roomId, data);

        });

        // Call onDisconnect.
        socket.on('disconnect', function () {
            onDisconnect(socket);
            console.info('[%s] DISCONNECTED', socket.address);
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