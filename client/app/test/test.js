'use strict';

angular.module('coboard')
    .config(function ($stateProvider) {
        $stateProvider
            .state('test', {
                url: '/',
                views : {
                    main : {
                        templateUrl: 'app/main/main.html',
                        controller: 'BoardController'
                    }
                },
                data : { title:'Login' }
            })
    });