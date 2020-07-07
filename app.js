const express = require("express");
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');


//load the environment variable file
require('dotenv').config({path:"./config/keys.env"});

const app = express();

 //set handlebars as template engine
app.engine('handlebars', exphbs()); 
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended:false})); //make form data available via req.body

app.use(express.static('./public/img'));  // USE IMG
app.use(express.static('./public/css'));  // USE CSS


//load controllers
const generalController = require("./controller/general");
const loginController = require("./controller/login");
const registrationController = require("./controller/registration");

//map each controller to the app object
app.use("/", generalController);
app.use("/login", loginController);
app.use("/registration", registrationController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log("Web Server Available");
})