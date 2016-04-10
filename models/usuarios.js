var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/bybDataBase");
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var usuarioSchema = new Schema();
var rolSchema = new Schema();
var proyectosSchema = new Schema();

 usuarioSchema.add({
id:ObjectId,
nombre: String,
apellidoP: String,
apellidoM: String,
email: String,
contrasena:{type:String, minlength:[6,"El password es muy corto"]/*,validate:{
      validator: function(p){
        return this.confirmarPassword == p;
      }, message: "Las contraseñas no son iguales"
      }*/
    },
proyectos:[ {proyectosSchema,rolSchema} ]
});

rolSchema.add({
    id:ObjectId,
    nombreRol:String,
})

proyectosSchema.add({
   id:Schema.ObjectId,
   nombreProyecto: String,
   fechaSolicitud: String,
   fechaArranque: String,
   descripcion: String,
   proyectManager: {usuarioSchema},
   productOwner: {usuarioSchema},
   equipoInvolucdrado: {usuarioSchema}
});

usuarioSchema.virtual("confirmarPassword").get(function(){
   return this.otroPassword; 
}).set(function(contrasena){
    this.otroPassword = contrasena;
});

 


//var Usuario = mongoose.model("Usuario",usuarioSchema);
module.exports ={ 
    Usuario: mongoose.model('Usuario',usuarioSchema),
    Rol: mongoose.model('Rol',rolSchema),
    Proyecto: mongoose.model('Proyecto',proyectosSchema)
};