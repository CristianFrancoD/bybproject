var express = require("express");
var app = express();

app.set("view engine","jade");

app.get("/login",function(req, res) {
  res.render("login");
});

app.get("/signup",function(req, res) {
  res.render("signup");
});

app.get("/",function(req, res){
  res.render("start");
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

app.listen(8080);
