var express = require("express");
var http = require("http");
var ConnectRoles = require("connect-roles");
var app = express();
var bodyParser = require("body-parser");
var Usuario = require("./models/usuarios").Usuario;
var Rol = require("./models/usuarios").Rol;
var Proyecto = require("./models/usuarios").Proyecto;
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


app.get("/dashboard",user.can("anonymousUser"), function(req, res) {

  Proyecto.count({proyectManager:req.session.user},function(err,count){
    if(count!=0){
      console.log("Numero de proyectos",count);
       res.redirect("/simple-cards")
    }
    res.render("layout");
  })



});



app.get("/api/proyectos",user.can("anonymousUser"),function(req, res) {
     Proyecto
     .find({proyectManager:req.session.user})
    .exec(function (err, usuario) {
  if (err) console.log(String(err));

  console.log(usuario);
  res.json(usuario);
});
})


app.get("/proyect",user.can("anonymousUser"),user.can("product-owner"),function(req, res){
    res.render("proyects");
});

app.get("/productBacklog",user.can("anonymousUser"),function(req,res){

    res.render("prodBacklog");


});

app.get("/simple-cards",user.can("anonymousUser"),function(req,res){
   var data = [];
    Proyecto
      .find({$or:[{proyectManager:req.session.user},{equipoInvolucdrado:req.session.user}]})
      .populate('proyectManager')
      .populate('equipoInvolucdrado')
      .populate('productOwner')
      .exec(function (err, proyecto) {
      if (err) console.log(String(err));
        console.log("ALTO");
        console.log(proyecto);
        for(var val in proyecto) {
           data.push(proyecto[val])

        }
        
       res.render("home/simple-cards",{
        proyecto:data
      });
})
})


app.get("/profile",user.can("anonymousUser"),function(req,res){

    res.render("profile");


});

app.get("/editProfile",user.can("anonymousUser"),function(req,res){

    res.render("editProfile");


});

app.post("/signup", function(req,res){

var usuario = new Usuario({
nombre: req.body.nombre,
apellidoP: req.body.apellidoP,
apellidoM: req.body.apellidoM,
email: req.body.email,
contrasena: req.body.contra,
//otropassword: req.body.otropassword
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



app.post("/agregarDesarrolador/:idUsuario/:idProy", function(req,res){
    res.render("home/agregarDesarrolador");
    console.log(req.params.idProy);
    console.log(req.params.idUsuario);
   Proyecto.findByIdAndUpdate(req.params.idProy, { $set : {equipoInvolucdrado:req.params.idUsuario}},function(err,proyecto){
       if(err)console.log(String(err));
       console.log(proyecto);
   })
});

app.post("/agregarPO/:idUsuario/:idProy", function(req,res){
    res.render("home/agregarDesarrolador");
    console.log(req.params.idProy);
    console.log(req.params.idUsuario);
   Proyecto.findByIdAndUpdate(req.params.idProy, { $set : {productOwner:req.params.idUsuario}},function(err,proyecto){
       if(err)console.log(String(err));
       console.log(proyecto);
   })
});


app.post("/sessions", function(req, res){
    Usuario.findOne({email:req.body.email, contrasena:req.body.contra},function(err,user){

      req.session.user = user._id;
      req.session.rol = user.rol;
       console.log(req.session.user);
 //      console.log(req.session.rol);
      res.redirect("/dashboard");
    });
});

app.post("/dashboard",function(req,res){
  console.log(req.body);
  console.log(req.session.user);
  var proyecto = new Proyecto({

    nombreProyecto:req.body.nombreProyecto,
    fechaSolicitud:req.body.fechaSolicitud,
    fechaArranque:req.body.fechaArranque,
    descripcion:req.body.descripcion,
    proyectManager:req.session.user
  });
  proyecto.save().then(function(proj){
    console.log(proj._id);
    Usuario.findByIdAndUpdate(req.session.user, { $set: { proyectos:proj._id }}, function (err, user) {
    if (err) console.log(String(err));
    console.log(user);

});
    res.redirect("/simple-cards");
    console.log("Se creo el proyecto-");
    console.log(proj);
  },function(err){
    console.log(String(err));
    console.log("Hubo un error");
  })
})

// Agregar PO.
// Agregar Developers.
// Eliminar proyecto.
app.post("/addpo/:_idProy", function(req, res) {
  var dataUser = [];
  console.log(req.params._idProy);
  Usuario.find()
  .populate('proyectos')
  .exec(function(err,users){
    for(var i in users){
      dataUser.push(users[i]);
    }
    
    console.log(String(err));
  
  
  res.render("addProjectOwners",{
    users:dataUser,
    idProy:req.params._idProy
  });
  })
});

app.post("/adddev", function(req, res) {
  res.render("addDevelopers");
});

app.post("/adddev/:_idProy",user.can("anonymousUser"), function(req, res) {
  var dataUser = [];
  console.log(req.params._idProy);
  Usuario.find()
  .populate('proyectos')
  .exec(function(err,users){
    for(var i in users){
      dataUser.push(users[i]);
    }
    
    console.log(String(err));
  
  
  res.render("addDevelopers",{
    users:dataUser,
    idProy:req.params._idProy
  });
  })
});

app.post("/delProject", function(req, res) {
  res.render("deleteProject");
});



app.post("/profile", function(req, res){
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
