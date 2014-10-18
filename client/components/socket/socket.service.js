/* global io */
'use strict';

angular.module('coboard')
  .factory('socket', function(socketFactory, Auth) {
    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      'query': 'token=' + Auth.getToken()
    });

    var socket = socketFactory({
      ioSocket: ioSocket
    });

    return socket;
  });