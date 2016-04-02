var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var Usuario = require("./models/usuarios").Usuario;
app.set("view engine","jade");

// Se le indica a express que se debe utilizar el directorio public.
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));
app.get("/",function(req, res){
  res.render("landing");
});

app.get("/login",function(req, res) {
  res.render("login");

});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/signup",function(req, res) {
  res.render("signup");


});

// Se redireciona al Dashboard.
app.get("/dashboard", function(req, res) {
  res.render(
    "index", {
      titulo: "Dashboard"
    }
  );
});

app.get("/proyect",function(req, res){
    res.render("proyects");
});

app.get("/productBacklog",function(req,res){
    res.render("prodBacklog");
});

app.post("/signup", function(req,res){
  
var usuario = new Usuario({ 
nombre: req.body.nombre, 
apellidoP: req.body.apellidoP,
apellidoM: req.body.apellidoM,
email: req.body.email,
contrasena: req.body.contra,
otropassword: req.body.otropassword
});
usuario.save().then(function(us){
res.redirect("/")
console.log("Se guardo el usuario");

},function(err){

  console.log(String(err));
  console.log("Hubo un error al guarda el usuario")
  res.redirect("/signup");
});

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
