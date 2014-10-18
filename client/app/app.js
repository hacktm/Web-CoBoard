'use strict';

angular.module('coboard', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $sceDelegateProvider) {

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/');

  $httpProvider.interceptors.push('AuthInterceptor');

  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'http://www.youtube.com/**',
    'http://www.soundcloud.com/**'
  ]);
})

.run(function($rootScope, $location, $timeout, Auth) {
  // Redirect to login if route requires auth and you're not logged in
  $rootScope.$on('$stateChangeStart', function(event, next) {
    Auth.isLoggedInAsync(function(loggedIn) {
      if ( next.authenticate && !loggedIn ) {
        $timeout(function(){
          $location.path('/login');
        });
      }
    });
  });
})

.controller('main', function($scope, socket){


  $scope.socketTest=function() {

    var roomId = null;

    console.log(socket);

    socket.emit('room.create',{

    });

    socket.on('room.created',function(data){

        roomId = data.roomId;
        console.log("Room with ID " + roomId + " Created");

    });



      //socket.emit('info:"b"});
  };

});