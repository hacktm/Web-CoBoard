'use strict';

angular.module('coboard')

    .controller('TestController', function( $scope, socket ) {

	function logOperation(operation, message, data) {
		console.log("Client " + operation + ": " + message + "\n" + JSON.stringify(data));
	}
	
	function addHandlers(socket) {
		if (socket.initialized)
			return;
		
		socket.on('message',function(data){
			logOperation("received", "message", data);
			console.log("Received message from server",data);
			$scope.message = data.message;
		});

		socket.on('room.created',function(data) {
			logOperation("room.created", "message", data);
			$scope.roomId = data.roomId;
		});
		
		socket.on('room.left', function(data) {
			logOperation("received", "room.left", data);
			$scope.roomId = "";
		});
		
		socket.on('room.joined', function(data) {
			logOperation("received", "room.joined", data);
			$scope.roomId = data.roomId;
		});
		
		socket.on('error', function(data) {
			logOperation("received", "error", data);
		});
		
		socket.on('rooms.listed', function(data) {
			logOperation("received", "rooms.listed", data);
		});

		socket.on('users.listed', function(data) {
			logOperation("received", "users.listed", data);
		});
		
		socket.initialized = true;
	}

	$scope.roomId = null;
	$scope.init = function() {};

	$scope.sendMessage = function() {
		addHandlers(socket);
		var data = {"roomId": $scope.roomId, "user": $scope.userName, "message": $scope.message};
		logOperation("sending", "message", data);
		socket.emit('message', data);
	};
	
	$scope.createRoom = function() {
		addHandlers(socket);
		var data = {"name": $scope.roomName, "user": $scope.userName};
		logOperation("sending", "room.create", data);
		socket.emit('room.create', data);
	};

	$scope.leaveRoom = function() {
		addHandlers(socket);
		var data = {"roomId": $scope.roomId, "user": $scope.userName};
		logOperation("sending", "room.leave", data);
		socket.emit('room.leave', data);
	};
	
	$scope.joinRoom=function() {
		addHandlers(socket);
		var data = {"roomId": $scope.roomId, "user": $scope.userName};
		logOperation("sending", "room.join", data);
		socket.emit('room.join', data);
	};
	
	$scope.listRooms = function() {
		addHandlers(socket);
		socket.emit("rooms.list", {});
	};
		
	$scope.listUsers = function() {
		addHandlers(socket);
		socket.emit("users.list", {});
	};
});
	
	