'use strict';

angular.module('coboard')

.controller('HomepageController', function( $scope, socket, $location){

	$scope.name = '';

	$scope.init = function() {

	};

	$scope.startRoom = function(){
		socket.emit('room.create', {name: $scope.name, room: null});
		$location.path('/join')
	}

});