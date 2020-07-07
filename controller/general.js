const express = require('express');


const router = express.Router();

const homeFood = require("../model/homeFoodDB.js"); //get DATABSE
const homeContent = require("../model/homeContent.js");
const listingFood = require("../model/listingFood.js");


//HomePage
router.get("/", (req,res)=>{
    const food_home = new homeFood();
    const content_home = new homeContent();
    // Set title
    res.render("home",{
        title: "Home",
        homeContent: content_home.homeContent,
        homeFood: food_home.homeFood
    });
    
});

//FoodListing
router.get("/foodListing", (req,res)=>{
    const food_listing = new listingFood();
    // Set title
    res.render("foodListing",{
        title: "Meal Package Listing",
        listingFood: food_listing.listingFood
    });
    //

});





module.exports = router;