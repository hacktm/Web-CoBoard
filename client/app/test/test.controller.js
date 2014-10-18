'use strict';

angular.module('coboard')

    .controller('TestController', function( $scope, socket ){

        $scope.roomId = null;

        $scope.init = function() {

        };

        $scope.creatRoom = function() {

        };

        $scope.createRoom = function() {

            var roomName = $scope.roomName;
            socket.emit('room.create',{});

            socket.on('room.created',function(data){
                var roomId = data.roomId;
                $scope.roomId = roomId;
                console.log("Room with ID " + roomId + " Created");

            });
        };


         $scope.joinRoom=function() {

            var roomId = $scope.roomId;

             console.log('Joining room with id',roomId);
            var data = {
                'roomId' : roomId,
                'a' : 'b'
            }

             socket.emit('room.join',{
                 'roomId' : roomId
             });

             socket.on('message',function(data){
                 console.log("Received from server",data);
             });

             setTimeout(function(){

             socket.emit('message',data);
             },2000);



        };
    });