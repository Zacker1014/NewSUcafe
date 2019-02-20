//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('/'));


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname));


mongoose.connect("mongodb://localhost:27017/SUCAFE", {
  useNewUrlParser: true
});


var globalOrderID = 0;

const userSchema = {
  fname: String,
  lname: String,
  netid: String,
  password: String,
  occupation: String,
  email: String
}

const User = mongoose.model("user", userSchema);



const itemsSchema = {
  name: String,
  price: Number
};

const Item = mongoose.model("item", itemsSchema); //item is singular


const orderSchema = {
  userid: Number,
  items: [itemsSchema],
  price: Number,
  status: String
}

const Order = mongoose.model("order", orderSchema);


/////////////////////////////////testing/////////////

// const user1 = new User({
//   fname: "Zinan",
//   lname: "Ma",
//   netid: "123",
//   password: "String",
//   occupation: "OC",
//   email: "1@e.com"
// });
//
// //user1.save();

// const item1 = new Item({
//   name: "coke",
//   price: 2.0
// });
//
// item1.save();
//
// const item2 = new Item({
//   name: "cake",
//   price: 3.0
// });
//
// item2.save();
//
// const test = [item1, item2];

// const order0 = new Order({
//   userid: globalOrderID,
//   items: test,
//   status: "Processing"
// });
//
// //order0.save();

/////////////////////////////////testing/////////////



app.get("/", function(req, res) {
  res.sendFile(__dirname + "/home.html"); //__dirname:current file location
});

app.get("/studentMenu",function(req,res){
  res.render("student/studentMenu");
});

app.post("/addOrder",function(req,res){
  console.log(1080);
  console.log(req.body.addedOrderInfo); //this give back an order in string format
  var newOrder = JSON.parse(req.body.addedOrderInfo);
  var newOrderObj = new Order(newOrder);
  newOrderObj.save();

  res.redirect("/orderSuccess.html");
});


app.post("/signin.html", function(req, res) {
  console.log("statusCode for Signin.html");
  console.log(res.statusCode);

  const inNid = req.body.netID;
  const inPw = req.body.password;

  User.findOne({
    netid: inNid
  }, function(err, idd) {
    if (!err) {
      if (!idd) {
        //can not find id
        res.sendFile(__dirname + "/failure.html");
      } else {
        if (idd.password === inPw) { //Successfully sign in

          if (idd.occupation === "stu") {
            res.redirect("/studentMenu");
          } else if (idd.occupation === "mng") {

            // let allOrders=[];
            // let allUsers=[];

            Order.find({}, function(err, foundItems) {
              if (err) {
                console.log(err);
              } else {
                User.find({}, function(err, foundItems2) {
                  if (err) {
                    console.log(err);
                  } else {
                    res.render("Manager/manager", {
                      ordersinfo: foundItems,
                      usersinfo: foundItems2
                    });
                  }
                });
              }
            });
          } else if (idd.occupation === "epe") { //if this person is employee
            Order.find({
              status: "Processing"
            }, function(err, foundItems) { //find processing orders
              if (foundItems.length === 0) { // If there is no Order now
                res.send('There is no Order now.');
                console.log("no order");
              } else { // Render employee.ejs with empName and the list of Order that has Processing status
                console.log('There are some orders');
                res.render("employee/employee", {
                  ordersinfo: foundItems
                });
              }
            });
          } else {
            console.log("There are some problem with the occupation of this user.");
          }
        } else {
          res.sendFile(__dirname + "/failure.html");
        }
      }
    }
  });
});

app.post("/signup.html", function(req, res) {

  console.log(req.body);
  //for each new user
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const netID = req.body.netid;
  const passWord = req.body.pWord;
  const ocupaTion = req.body.selectpicker
  const uemail = req.body.email;
  // if the id does not exist
  //create an doc in database
  User.findOne({
    netid: netID
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        //create a new user
        const user = new User({
          fname: firstName,
          lname: lastName,
          netid: netID,
          password: passWord,
          occupation: ocupaTion,
          email: uemail
        });
        user.save();
        if (res.statusCode === 200) {
          res.sendFile(__dirname + "/success.html");
        }
      } else {
        //  console.log("id:""+netID);
        //netid already exist
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
  console.log("statusCode for Signup.html");
  console.log(res.statusCode);
});

//cannot update order and changes status to complete
app.post("/updateOrder", function(req, res) {
  console.log(req.body.checkbox);
  console.log(123);

  const checkedOrderId = req.body.checkbox;
  console.log(checkedOrderId);
  Order.updateOne({
    _id: checkedOrderId
  }, {
    status: "Complete"
  }, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("ready to update order");
      Order.find({
        status: "Processing"
      }, function(err, foundItems) { //find processing orders
        if (foundItems.length === 0) { // If there is no Order now
          res.send('There is no Order now.');
          console.log("no order");
        } else { // Render employee.ejs with empName and the list of Order that has Processing status
          console.log('There are some orders');
          res.render("employee/employee", {
            ordersinfo: foundItems
          });
        }
      });
    }
  });

});

app.post("/updateOrderM", function(req, res) {

  const checkedOrderId = req.body.checkbox1;
  Order.updateOne({
    _id: checkedOrderId
  }, {
    status: "Complete"
  }, function(err) {
    if (err) {
      console.log(err);
    } else {
      Order.find({
        status: "Processing"
      }, function(err, foundItems) { //find processing orders
        if (foundItems.length === 0) { // If there is no Order now
          res.send('There is no Order now.');
          console.log("no order");
        } else { // Render employee.ejs with empName and the list of Order that has Processing status
          console.log('There are some orders');
        }
      });
    }
  });
  ///////////////////////////////////////////////////
  Order.find({}, function(err, foundItems) {
    if (err) {
      console.log(err);
    } else {
      User.find({}, function(err, foundItems2) {
        if (err) {
          console.log(err);
        } else {
          res.render("Manager/manager", {
            ordersinfo: foundItems,
            usersinfo: foundItems2
          });
        }
      });
    }
  });
  ///render manager

});


app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox2;

  User.findByIdAndRemove(checkedItemId, function(err) {
    if (!err) {
      console.log(checkedItemId);
      console.log("Successfully delete checked item.");

///////////////////////////////////////////////////
Order.find({}, function(err, foundItems) {
  if (err) {
    console.log(err);
  } else {
    User.find({}, function(err, foundItems2) {
      if (err) {
        console.log(err);
      } else {
        res.render("Manager/manager", {
          ordersinfo: foundItems,
          usersinfo: foundItems2
        });
      }
    });
  }
});
///render manager
    } else {
      console.log("Error!~");
    }
  });

});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
