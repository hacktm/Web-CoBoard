'use strict';

angular.module('coboard')

    .controller('TestController', function( $scope, socket ) {

	function logOperation(operation, message, data) {
		console.log("Client " + operation + ": " + message + "\n" + JSON.stringify(data));
	}
	
	var canvasMoused = false;
	var coordinates = {"x": -1, "y": -1};
	
	function translateCanvasCoordinates(x, y) {
		var canvas = document.getElementById('canvas');
		var canvasX = canvas.offsetLeft;
		var canvasY = canvas.offsetTop;
		return {"x": x - canvasX, "y": y - canvasY};
	}
	
	function handleCanvasMessage(data) {
		var ctx = document.getElementById('canvas').getContext('2d');
		var newCoordinates = translateCanvasCoordinates(data.x, data.y);
		console.log("Old coordinates: [" + coordinates.x + ", " + coordinates.y + "]");
		console.log("New coordinates: [" + newCoordinates.x + ", " + newCoordinates.y + "]");
		ctx.fillStyle = "#FF0000";
		ctx.strokeStyle ="#FFFFFF";
		if (data.mouseEventType == "down") {
			console.log("Mouse down");
			canvasMoused = true;
			ctx.fillRect(newCoordinates.x - 1, newCoordinates.y - 1, 2, 2);
		}
		if ((data.mouseEventType == "move") && canvasMoused) {
			console.log("Mouse move");
			ctx.beginPath();
			ctx.moveTo(coordinates.x, coordinates.y);
			ctx.lineTo(newCoordinates.x, newCoordinates.y);
			ctx.stroke();
		}
		if (data.mouseEventType == "up") {
			console.log("Mouse up");
			ctx.beginPath();
			ctx.moveTo(coordinates.x, coordinates.y);
			ctx.lineTo(newCoordinates.x, newCoordinates.y);
			ctx.stroke();
			ctx.fillRect(newCoordinates.x - 1, newCoordinates.y - 1, 2, 2);
			canvasMoused = false;
		}
		coordinates = newCoordinates;
	}
	
	function addHandlers(socket) {
		if (socket.initialized)
			return;
		
		socket.on('message',function(data){
			logOperation("received", "message", data);
			console.log("Received message from server",data);
			if (data.type === "whiteboard") {
				handleCanvasMessage(data);
			} else {
				$scope.message = data.message;
			}
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

	$scope.listRoomsForUser = function() {
		addHandlers(socket);
		socket.emit("rooms.list", {"user": $scope.userName});
	};

	$scope.listUsersForRoom = function() {
		addHandlers(socket);
		socket.emit("users.list", {"room": $scope.roomId});
	};
	
	$scope.canvasMouseDown = function(event) {
		if (!($scope.roomId))
			return;
		socket.emit('message', {"roomId": $scope.roomId, "type": "whiteboard", "x": event.pageX, "y": event.pageY, "mouseEventType": "down", "user": $scope.userName});
	}
	
	$scope.canvasMouseMove = function(event) {
		if (!($scope.roomId))
			return;
		socket.emit('message', {"roomId": $scope.roomId, "type": "whiteboard", "x": event.pageX, "y": event.pageY, "mouseEventType": "move", "user": $scope.userName});
	}
	
	$scope.canvasMouseUp = function(event) {
		if (!($scope.roomId))
			return;
		socket.emit('message', {"roomId": $scope.roomId, "type": "whiteboard", "x": event.pageX, "y": event.pageY, "mouseEventType": "up", "user": $scope.userName});
	}
});

