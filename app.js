const express = require("express");
const exphbs  = require('express-handlebars');
require('dotenv').config({path:"./config/keys.env"});
const bodyParser = require('body-parser');
const clientSessions = require('express-session')
const multer = require("multer");
const path = require('path');
//load the environment variable file


const data = require("./controller/data.js");
//let db = mongoose.createConnection("mongodb+srv://xxiao22:XMM4ever!@cluster0.voo2y.mongodb.net/web322_assignment?retryWrites=true&w=majority");

const app = express();
const jsonParser = bodyParser.json()
 //set handlebars as template engine
app.engine('handlebars', exphbs()); 
app.set('view engine', 'handlebars');

app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: process.env.SESSION_SECRET, // this should be a long un-guessable string.
    duration: 15 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 10 * 1000 * 60 // the session will be extended by this many ms each request (1 minute)
  }));
  
app.use(bodyParser.urlencoded({extended:false})); //make form data available via req.body

app.use(express.static('public'));  // USE IMG


//load controllers
const generalController = require("./controller/general");
const { decodeBase64 } = require("bcryptjs");
// const loginController = require("./controller/login");
// const registrationController = require("./controller/registration");

// //map each controller to the app object
app.use("/", generalController);
// app.use("/login", loginController);
// app.use("/registration", registrationController);

const PORT = process.env.PORT || 3000;

const storage = multer.diskStorage({
    destination: './public/img/',
    fieldname: function(req, file, cb){
        cb(null, fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
// Initialize upload
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      return cb(null, true);
    } else {
      return cb(new Error('Not an image! Please upload an image.', 400), false);
    }
  };

  
const upload = multer({
    storage: storage,
    fileFilter: imageFilter
});


data.initialize()
.then(data.readFromMongo)
.then(()=>{
    console.log("Reading data from MongoDB");
    app.listen(PORT, ()=>{
        console.log("Web Server Available");
    });
}).catch((err)=>{
    console.log(err);
});
///////////////////////////////////////////////////////////////////LOGIN//////////////////////////////////////////////////////////////////////////
app.get("/login", (req,res)=>{
    res.render("login",{
        title: "Login"
    });
});


app.post("/login", (req,res)=>{
    data.validateUser(req.body)
    .then((returnedUser)=>{
        req.session.user = returnedUser;
        res.render("private",{userInfo: req.session.user.toJSON() });
    }).catch((data)=>{
        res.render("login",{errorMessage:data});
    })
});


app.get("/private", ensureAdmin, (req,res)=>{
    res.render("private", {
        userInfo: user,
        session: session
    });
});

app.get("/logout", (req,res)=>{
    req.session.destroy();
    res.redirect("/login");
});

function ensureAdmin(req, res, next) {
    if (!req.session.user || req.session.user.clerk!=true) {
      res.redirect("/login");
    } else {
      next();
    }
  }
  function ensureUser(req, res, next) {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      next();
    }
  }
  
  ///////////////////////////////////////////////////////////////////REGISTER//////////////////////////////////////////////////////////////////////////
  app.get("/registration", (req,res)=>{
    // Set title
    res.render("registration",{
        title: "Registration"
    });


});

app.post("/registration", (req,res)=>{
    data.validateRegister(req.body)
     .then((userInfo) => data.addUser(userInfo))
     .then(()=>{
         res.redirect("/login");
     }).catch((inputs)=>{
        res.render("registration",{errorMessage:inputs});

     })
 })
 /////////////////////////////////////////////////////////////////Clerk///////////////////////////////////////////////////////////////////

 app.get('/addMeal', ensureAdmin, (req,res)=>{
     res.render('addMeal');
 })

 app.post('/addMeal', upload.single("photo"), (req, res)=>{
     req.body.image = req.file.filename;
     data.addMeal(req.body).then(()=>{
         res.redirect('/');
     }).catch((err)=>{
         console.log("Failed to add meal" + err);
         res.redirect('/addMeal');
     })
 })

 app.get('/viewMeal', (req, res)=>{
    data.getListingFood()
    .then((food)=>{
        res.render("viewMeal", {
            title: "View Meal Packages",
            listingFood: (data.food!=0)?food:undefined
        })
    }).catch((err)=>{
        console.log("Failed to load data and display data in listing page" + err);
        res.render("viewMeal",{
            title: "View Meal Packages"
        })
    })
 })
app.get("/viewMeal/:name", ensureAdmin,(req, res)=>{
    if (req.params.name){ 
        data.getMealPackage(req.params.name)
        .then((mealPackage)=>{
            res.render("editMeal", {data:mealPackage.toJSON()}); 
        }).catch(()=>{
          console.log("couldn't find the Meal");
          res.redirect("/");
        });
      }
      else
        res.redirect("/viewMeal");
})

// app.post('/addMeal', upload.single("photo"), (req, res)=>{
//     req.body.image = req.file.filename;
//     data.addMeal(req.body).then(()=>{
//         res.redirect('/');
//     }).catch((err)=>{
//         console.log("Failed to add meal" + err);
//         res.redirect('/addMeal');
//     })
// })
app.post("/viewMeal/:name", ensureAdmin, upload.single("photo"),(req,res)=>{
    req.body.image = req.file.filename;
    data.editMealPackages(req.body)
    .then(()=>{
        res.redirect("/viewMeal");
      }).catch((err)=>{
        console.log(err);
        res.redirect("/viewMeal");
      })
   });
  

   
///////////////////////////////////////////////////////////////////////////////USER///////////////////////////////////////////////////////////////////////
app.get("/cart",ensureUser, (req,res)=>{
    let cartData = {
        cart:[],
        total:0
    } ;

    data.getCart().then((items)=>{
        cartData.cart = items;
        data.checkout().then((total)=>{
            cartData.total = total;
            res.render("cart", {data:cartData});
        }).catch((err)=>{
            res.send("There was an error getting total: " +err);
        });
    })
    .catch((err)=>{
        res.send("There was an error: " + err );
    });
});
app.post("/addProduct", jsonParser, (req,res)=>{
    data.addItem(req.body)
    .then((itemQty)=>{
        res.send({qty: itemQty})
    })
})

app.post("/removeItem",jsonParser, (req,res)=>{ 
    var cartData = {
        cart:[],
        total:0
    } ;
    data.removeItem(req.body.name)
    .then(data.checkout)
    .then((inTotal)=>{
        cartData.total = inTotal;

        data.getCart()
        .then((items)=>{
            console.log("Items -------------->" + items);
            cartData.cart = items; 
            res.json({removed: cartData});
        }).catch((err)=>{res.json({error:err});});
    }).catch((err)=>{
        res.json({error:err});
    })
});


app.post("/placeorder", ensureUser,(req,res)=>{
    data.confirmationEmail(req.session.user)
    .then(data.cleanCart)
    res.end("Successfully send confirmation");


})