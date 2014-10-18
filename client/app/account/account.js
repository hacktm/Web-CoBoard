'use strict';

angular.module('coboard')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        views : {
          main : {
            templateUrl: 'app/account/login/login.html',
            controller: 'LoginCtrl'
          }
        },
        data : { title:'Login' }
      })
      .state('signup', {
        url: '/signup',
        views : {
          main : {
            templateUrl: 'app/account/signup/signup.html',
            controller: 'SignupCtrl'
          }
        },
        data : { title:'Sign up' }
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
  });