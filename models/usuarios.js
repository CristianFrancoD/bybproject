var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/bybDataBase");
var Schema = mongoose.Schema;




var usuarioSchema = new Schema({
nombre: String,
apellidoP: String,
apellidoM: String,
email: String,
contrasena:{type:String, minlength:[6,"El password es muy corto"]/*,validate:{
      validator: function(p){
        return this.confirmarPassword == p;
      }, message: "Las contraseñas no son iguales"
      }*/
    }
       
    

});

usuarioSchema.virtual("confirmarPassword").get(function(){
   return this.otroPassword; 
}).set(function(contrasena){
    this.otroPassword = contrasena;
});


var Usuario = mongoose.model("Usuario",usuarioSchema);
module.exports.Usuario = Usuario;

