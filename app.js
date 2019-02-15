//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('/'))


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));


mongoose.connect("mongodb://localhost:27017/SUCAFE",{useNewUrlParser: true});

const userSchema = {
  fname: String,
  lname: String,
  netid:String,
  password:String,
  occupation: String,
  email: String
}

const User = mongoose.model("user",userSchema);

const user1 = new User({
  fname:"Zinan",
  lname:"Ma",
  netid:"123",
  password:"String",
  occupation: "OC",
  email: "1@e.com"
});

//user1.save();

app.get("/",function(req,res){
res.sendFile( __dirname + "/home.html");//__dirname:current file location
});


app.post("/signin.html",function(req,res){
  console.log("statusCode for Signin.html");
  console.log(res.statusCode);
   console.log(req.body.netID);
   console.log(req.body.password);
});

app.post("/signup.html",function(req,res){

 console.log(req.body);
 //for each new user
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const netID =req.body.netid;
  const passWord =req.body.pWord;
  const ocupaTion = req.body.selectpicker
  const uemail =req.body.email;


  // if the id does not exist
  //create an doc in database

    User.findOne({
      netid: netID
    }, function(err, foundList) {
      if (!err) {
        if (!foundList) {
          //create a new list
          const user = new User({
            fname: firstName,
            lname: lastName,
            netid: netID,
            password: passWord,
            occupation: ocupaTion,
            email: uemail
          });
          user.save();
          if (res.statusCode===200){
            res.sendFile(__dirname+"/success.html");
          }
        } else {
        //  console.log("id:""+netID);
          //netid already exist
          res.sendFile(__dirname+"/failure.html");
        }
      }
    });



  console.log("statusCode for Signup.html");
  console.log(res.statusCode);



});





app.listen(3060, function() {
  console.log("Server started on port 3060");
});
