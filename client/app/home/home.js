'use strict';

angular.module('coboard')
  .config(function ($stateProvider) {
    $stateProvider
      .state('index', {
        url: '/',
        views : {
          main : {
            templateUrl: 'app/home/home.html',
            controller: 'HomepageController'
          }
        },
        data : { title:'Homepage' }
      })
  });