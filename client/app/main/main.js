'use strict';

angular.module('coboard')
  .config(function ($stateProvider) {
    $stateProvider
      .state('board', {
        url: '/board',
        views : {
          main : {
            templateUrl: 'app/main/main.html',
            controller: 'MainController'
          }
        },
        data : { title:'Login' }
      })
  });