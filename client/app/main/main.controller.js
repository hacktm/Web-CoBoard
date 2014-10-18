'use strict';

angular.module('coboard')

.controller('BoardController', function( $scope ){

	$scope.init = function() {
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