bybApp = angular.module("bybApp",[]);
bybApp.controller("backlogCtrl",function($scope,$http,$location){

    $scope.historias = [];
    $scope.userHistory = {};
    $scope.socket = io.connect("/",{'forceNew':true});

    $scope.getUserHistory = function(id){
        $scope.idProy = id;
        console.log("Se ejecuto la funcion");
        console.log("El Id es"+id);
        $http.get("/api/backlog/" + $scope.idProy).success(function(data){
            console.log(data);
            $scope.historias = data;
            console.log($scope.userHistorys);
        }).error(function(err){
            console.log(String(err))
        })
    };
$scope.showEditbacklog = function(id){
console.log(id);
$scope.historyToEdit = $scope.historias[id]
console.log($scope.historyToEdit);

}
$scope.editbacklog = function(){
    $http.post("/api/editbacklog",$scope.historyToEdit).success(function(data){
        console.log(data)
        $scope.socket.emit("editBacklog",$scope.historyToEdit);
    }).error(function(err){
        console.log(String(err))
    })
        
    
}


    $scope.saveUserHistory = function(id){
        console.log("posteando...");
        console.log("El id al hacer el post es: ",id)
        $scope.userHistory.proyectos = id;
        console.log($scope.userHistory);
        $http.post("/api/backlog/"+id,$scope.userHistory).success(function(data){
            console.log(data);
            $scope.socket.emit("mensajeNuevo",data);

        }).error(function(err){
            console.log(String(err));
        })
        //TODO socket.io


    }
     $scope.socket.on("enviarMensajes",function(data){
            $scope.historias = data;
            console.log($scope.historias);
            $scope.$apply();
     })
})
