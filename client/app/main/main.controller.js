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

	$scope.init = function() {
	};

	$scope.message = '';

	$scope.users = [{ id : 1, name : 'Ionica'}];

	$scope.messages = [{ text : 'test', user: 'user' }];

	$scope.send = function() {
		socket.emit('message', this.message);
	};
});