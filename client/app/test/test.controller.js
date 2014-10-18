'use strict';

angular.module('coboard')

    .controller('TestController', function( $scope, socket ) {

        $scope.roomId = null;
        $scope.init = function() {
     };

		$scope.sendMessage = function() {
			var roomId = $scope.roomId;
			var data = {"a": "b", "roomId": roomId};

			console.log("Room id", $scope.roomId);
			socket.on('message',function(data){
				console.log("Received message from server",data);
			});

			socket.emit('message', data);
			
		};
		
        $scope.createRoom = function() {
			var roomId = $scope.roomId;
            var roomName = $scope.roomName;
			
            socket.on('room.created',function(data){
                var roomId = data.roomId;
                $scope.roomId = roomId;
                console.log("Room with ID " + roomId + " Created");
            });

			socket.on('message',function(data){
				console.log("Received message from server",data);
			});
			
			socket.emit('room.create',{});

        };

        $scope.joinRoom=function() {
			var roomId = $scope.roomId;
			socket.on('message',function(data){
				console.log("Received message from server",data);
			});
			
			socket.on('room.joined', function(data) {
				console.log("Joined room",data);
			});
   
            var roomId = $scope.roomId;

            console.log('Joining room with id',roomId);
            socket.emit('room.join',{'roomId' : roomId});
        };
		
    });