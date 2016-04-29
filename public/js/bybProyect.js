bybApp = angular.module("bybApp",[]);
bybApp.controller("backlogCtrl",function($scope,$http,$location){
  
    $scope.historias = [];
    $scope.userHistory = {};
    //$scope.socket = io.connect("https://bybproyecttest-carlossn.c9users.io:8080/",{'forceNew':true});
    
    $scope.getUserHistory = function(id){
        $scope.idProy = id;
        console.log("Se ejecuto la funcion");
        console.log("El Id es"+id);
        $http.get("https://bybproyecttest-carlossn.c9users.io/api/backlog/" + $scope.idProy).success(function(data){
            console.log(data);
            $scope.historias = data;
            console.log($scope.userHistorys);
        }).error(function(err){
            console.log(String(err))
        })  
    }();
        $scope.login_click = function(){
        console.log("ejecutandose")
        $http.post("https://bybproyecttest-carlossn.c9users.io/sessions/").success(function(data){
            console.log(data);
            $scope.proyects = data;
            console.log($scope.proyects);
        }).error(function(err){
            console.log(String(err))
        })
    }
    
    $scope.saveUserHistory = function(id){
        console.log("posteando...");
        console.log("El id al hacer el post es: ",id)
        $scope.userHistory.proyectos = id;
        console.log($scope.userHistory);
        $http.post("https://bybproyecttest-carlossn.c9users.io/api/backlog/"+id,$scope.userHistory).success(function(data){
            console.log(data);
            $scope.historias.push($scope.userHistory);
        }).error(function(err){
            console.log(String(err));
        })
        //TODO socket.io
    }
})
