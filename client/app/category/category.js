'use strict';

angular.module('coboard')
  .config(function ($stateProvider) {
    $stateProvider
      .state('category', {
        url: '/category',
        views : {
          main : {
            templateUrl: 'app/category/category.html',
            controller: 'CategoryController'
          }
        },
        data : { title:'Categoty' }
      })
  });