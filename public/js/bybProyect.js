bybApp = angular.module("bybApp",[]);
bybApp.controller("backlogCtrl",function($scope,$http,$location){
    $scope.mensaje="Hola"
    $scope.getUserHistory = function(id){
        console.log("Se ejecuto la funcion");
        console.log("El Id es"+id);
        $http.get("https://bybproyecttest-carlossn.c9users.io/api/backlog/" + id).success(function(data){
            console.log(data);
            $scope.userHistorys = data;
            console.log($scope.userHistorys);
        }).error(function(err){
            console.log(String(err))
        })  
        
    }();
    
})