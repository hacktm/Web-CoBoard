'use strict';
angular.module('socketMock', [])
  .factory('socket', function( MicroEvent ) {
  	
  	var socket = new MicroEvent();

  	socket.connect = function(){};
  	socket.receive = function(){};

  	return socket;
  	
  });