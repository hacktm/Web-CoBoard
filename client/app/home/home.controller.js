'use strict';

angular.module('coboard')

.controller('HomepageController', function( $scope, socket){

	$scope.name = '';

	$scope.init = function() {

	};

	$scope.startRoom = function(){
		socket.emit('room.create', {name: $scope.name, room: null});
	}

});