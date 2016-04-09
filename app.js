var express = require("express");
var ConnectRoles = require("connect-roles");
var app = express();
var bodyParser = require("body-parser");
var Usuario = require("./models/usuarios").Usuario;
var session = require("express-session");
app.set("view engine","jade");
var user = new ConnectRoles({
  failureHandler: function (req,res,action){
    res.status(403);
    res.render("forbidden");
  }
});

// Se le indica a express que se debe utilizar el directorio public.
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({

secret: "fc47873566a1da7c3ca94ecccba88241",
resave: false,
saveUninittialized:false
}));

app.use(user.middleware());

user.use("anonymousUser",function(req) {
    if(req.session.hasOwnProperty("user")){
      console.log("No es anonimo");
    return true;  
    }
})


user.use("scrum-master",function(req){
  console.log(req.session.user);
  
    if(req.session.rol ==='scrum master'){
      console.log("entro scrum");
    return true;  
    
    
    
  }
})

user.use("product-owner",function(req){
  console.log(req.session.user);

    if(req.session.rol ==='product owner'){
      console.log("entro");
    return true;  
    }
    
})

user.use("desarrollador",function(req){
  console.log("Entro en funcion desarrollador")
    console.log(req.session.user);
  
    if(req.session.rol ==='desarrollador'){
      console.log("entro developer");
      return true;  
  }
  
})

user.use("profile",function(req){
  console.log(req.session.user);
  if(req.session.hasOwnProperty("user")){
    if(req.session.rol ==='Product Owner'){
      console.log("entro!");
    return true;  
    }
    
    
  }
})

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
app.get("/dashboard",user.can("anonymousUser"),user.can("desarrollador").here, function(req, res) {
  console.log(user.can("desarrollador"));
  res.render("home/developer")

});

app.get("/dashboard",user.can("anonymousUser"), function(req, res) {

  if(req.session.rol==='desarrollador'){
      res.render("home/developer");
  }else if(req.session.rol==='scrum master'){
      res.render("home/admin");
  }else if(req.session.rol==='product owner'){
      res.render("home/prodOwner")
   }
});

app.get("/dashboard",user.can("anonymousUser"),user.can("scrum-master"), function(req, res) {

  res.render("home/admin")

});

app.get("/proyect",user.can("anonymousUser"),user.can("product-owner"),function(req, res){
    res.render("proyects");
});

app.get("/productBacklog",user.can("anonymousUser"),function(req,res){
  
    res.render("prodBacklog");
  
    
});

app.get("/profile",user.can("anonymousUser"),function(req, res){
    res.render("profile",{nombreUsuario:"Hector Galvan"}
    );
});
app.get("/editProfile",user.can("anonymousUser"),function(req, res){
    res.render("editProfile");
});

app.post("/signup", function(req,res){
  
var usuario = new Usuario({ 
nombre: req.body.nombre, 
apellidoP: req.body.apellidoP,
apellidoM: req.body.apellidoM,
email: req.body.email,
contrasena: req.body.contra,
otropassword: req.body.otropassword,
rol:req.body.rol
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


app.post("/sessions", function(req, res){
    Usuario.findOne({email:req.body.email, contrasena:req.body.contra},function(err,user){

      req.session.user = user._id;
      req.session.rol = user.rol;
       console.log(req.session.user);
       console.log(req.session.rol);
      res.redirect("/dashboard");
    });
});




/*app.post("/profile", function(req, res){
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
*/
app.listen(8080);
