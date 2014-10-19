'use strict';

angular.module('coboard')
  .config(function ($stateProvider) {
    $stateProvider
      .state('board', {
        url: '/board/room/:room',
        views : {
          main : {
            templateUrl: 'app/main/main.html',
            controller: 'BoardController'
          }
        },
        data : { title:'Login' }
      })
  });