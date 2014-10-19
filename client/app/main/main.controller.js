'use strict';

angular.module('coboard')

.controller('BoardController', function( $scope, $stateParams, socket ){

        $scope.roomId = null;
        $scope.userName = "Ovidiu23";

	$scope.init = function() {

        socket.on('room.joined', function(data){
            console.log('joined room');
        });

        $scope.roomId = $stateParams.room;
        var data = {"roomId": $scope.roomId, "user": $scope.userName};

        console.log("Joining room " + $scope.roomId);
        socket.emit('room.join', data);

    };
	
	$scope.logout = function() {
		alert('Logout');
	};
})

.controller('chat', function($scope,socket){

        $scope.sendMessage = function() {
            var data = {"roomId": $scope.roomId, "user": $scope.userName, "message": $scope.message};
            socket.emit('message', data);
        };


        $scope.init = function() {

        socket.on('users.listed',function(data){

            $scope.users = data;

        });

        socket.on('message',function(data){
            console.log(data);
            var message= {
                text: data.message,
                user: data.user
            }
            $scope.messages.push(message);
        });

        socket.emit('users.list', {
            room: $scope.roomId
        });

	};

	$scope.message = '';

	$scope.messages = [{ text : 'test', user: 'user' }];

	$scope.send = function() {
		socket.emit('message', this.message);
	};
});