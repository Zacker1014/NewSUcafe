//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));


//mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true});


app.get("/",function(req,res){
res.sendFile( __dirname + "/home.html");//__dirname:current file location
});




app.listen(3060, function() {
  console.log("Server started on port 3060");
});
