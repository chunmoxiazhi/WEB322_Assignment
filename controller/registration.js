const express = require('express');
const data = require("./data.js");

const router = express.Router();

const homeContent = require("../model/homeContent.js");
const listingFood = require("../model/listingFood.js");

//Registration



/*router.post("/", (req,res)=>{
   // console.log(`${req.body.first}`); //print out the text user entered. 
    const{first, last, email, password, confirmPassword} = req.body;
    const errors = [];
    let uLetter = /[A-Z]/; 
    let lLetter = /[a-z]/; 
    let upper = password.search(uLetter);
    let lower = password.search(lLetter);
    console.log (req.body);
    if (first == ""){
        errors.push ("First name is missing!");
    }
    if (last == ""){
        errors.push ("Last name is missing!");
    }
    if (upper < 0 || lower < 0){
        errors.push ("Password needs to contain at least one upper case and one lower case character!");
    }
    if (password != confirmPassword){
        errors.push ("Confirmed password has to be identical to your password!");
    }


    if (errors.length > 0){
        res.render("registration",{
            title: "Registration",
            errorMessage:errors
        });
    }
    else{
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
        const msg = {
        to:`${email}` ,
        
        from: `xxiao22@myseneca.ca`,
        subject: 'Welcome to Shilee\'s Food Truck',
        text: 'Hello',
        html: `Hello ${first} ${last}!
                Welcome to Shilee\'s Food Truck! `,
        };
        sgMail.send(msg)
        .then(()=>{
            res.redirect("/");
        })
        .catch(err=>{
            console.log(`Error ${err}`);
        })

       
    }

})*/

module.exports = router;
