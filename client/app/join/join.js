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
  });