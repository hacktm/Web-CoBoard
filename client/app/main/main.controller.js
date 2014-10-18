'use strict';

angular.module('coboard')

.controller('BoardController', function( $scope ){

	$scope.init = function() {

	};
	
	$scope.logout = function() {
		alert('Logout');
	};
});