const express = require('express');
const router = express.Router();

const homeContent = require("../model/homeContent.js");
const listingFood = require("../model/listingFood.js");

//Login
router.get("/", (req,res)=>{
    // Set title
    res.render("login",{
        title: "Login"
    });
    //

});
router.post("/", (req,res)=>{
    console.log(`${req.body.first}`); //print out the text user entered. 

    const errors = [];
    if (req.body.email == ""){
        errors.push ("Please enter your eMail address.");
    }
    if (req.body.password == ""){
        errors.push ("Please enter your password.");
    }

    if (errors.length > 0){
        res.render("login",{
            title: "Login",
            errorMessage:errors
        });
    }
    else{
        res.redirect("/");
    }

})



module.exports = router;