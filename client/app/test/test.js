'use strict';

angular.module('coboard')
    .config(function ($stateProvider) {
        $stateProvider
            .state('test', {
                url: '/test',
                views : {
                    main : {
                        templateUrl: 'app/test/test.html',
                        controller: 'TestController'
                    }
                },
                data : { title:'Test' }
            })
    });