'use strict';

angular.module('coboard')
  .config(function ($stateProvider) {
    $stateProvider
      .state('join', {
        url: '/join',
        views : {
          main : {
            templateUrl: 'app/join/join.html',
            controller: 'JoinController'
          }
        },
        data : { title:'Join' }
      })
  })
  .controller('join', function($scope){
    
    $scope.rooms = [{name: 'test1', members: 21},{name: 'test2', members: 21},{name: 'test3', members: 21}];

    $scope.joiRoom = function(){

    };

  });