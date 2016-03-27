var express = require("express");
var app = express();

app.set("view engine","jade");

// Se le indica a express que se debe utilizar el directorio public.
app.use(express.static(__dirname + '/public'));

// Se redirecciona a Landing.
app.get("/",function(req, res){
  res.render("landing");
});

app.get("/login",function(req, res) {
  res.render("login");
});

app.get("/signup",function(req, res) {
  res.render("signup");
});

// Se redireciona al Dashboard.
app.get("/dashboard", function(req, res) {
  res.render("dashboard");
});

app.get("/proyect",function(req, res){
    res.render("proyects");
});

app.get("/productBacklog",function(req,res){
    res.render("prodBacklog");
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/profile", function(req, res){
    var nombreUsuario="Hector Galvan";
    var fechaNacimiento="15/09/1992";
    var curp="";
    var RFC="";
    var domicilio="";
    var habiidades=["habilidad1","habilidad2","habilidad3"]


   res.render("profile",{nombreUsuario:nombreUsuario,
                        fechaNacimiento:fechaNacimiento,
                        curp:curp,
                        RFC:RFC,
                        domicilio:domicilio,
                        habilidades:habiidades
   });
});

app.listen(8080);
