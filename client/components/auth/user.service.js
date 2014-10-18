'use strict';

angular.module('coboard')

.factory('User', function ( $resource ) {
    return $resource('/api/users/:id/:action', {
            id: '@_id'
        },
        {
            changePassword: {
                method: 'PUT',
                params: {
                    action: 'password'
                }
            },
            
            get: {
                method: 'GET',
                params: {
                    id: 'me'
                }
            },
            
            songs : {
                method: 'GET',
                params: {
                    action: 'songs'
                },
                isArray:true
            },

            favourites : {
                method: 'GET',
                params: {
                    action: 'favourites'
                },
                isArray:true
            },

            scanning : {
                params : {
                    id: 'me',
                    action: 'scanning'
                },
                authenticate : true
            },
            
            songsQueue : {
                method : 'GET',
                params : {
                    id: 'me',
                    action: 'queue'
                },
                authenticate : true
            }
        });
});
