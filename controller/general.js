const express = require('express');
const data = require("./data.js");

const router = express.Router();

//const homeFood = require("../model/homeFoodDB.js"); //get DATABSE
const homeContent = require("../model/homeContent.js");
//const listingFood = require("../model/listingFood.js");
//const { decodeBase64 } = require('bcryptjs');


//HomePage
router.get("/", (req,res)=>{
   // const food_home = new homeFood();
    const content_home = new homeContent();
    data.getHomeFood()
    .then((food)=>{
        res.render("home", {
            title: "Home",
            homeContent: content_home.homeContent,
            homeFood: (food.length!=0)?food:undefined
        })
    }).catch((err)=>{
        console.log("Failed to load data and display data in home page" + err);
        res.render("home",{
            title: "Home"
        })
    })

    
});

//FoodListing
router.get("/foodListing", (req,res)=>{
   // const food_listing = new listingFood();
   data.getListingFood()
   .then((food)=>{
       res.render("foodListing", {
           title: "List of Meal Packages",
           listingFood: (data.food!=0)?food:undefined
       })
   }).catch((err)=>{
       console.log("Failed to load data and display data in listing page" + err);
       res.render("foodListing",{
           title: "List of Meal Packages"
       })
   })
});


router.get("/foodListing", (req,res)=>{
    // const food_listing = new listingFood();
    data.getListingFood()
    .then((food)=>{
        res.render("foodListing", {
            title: "List of Meal Packages",
            listingFood: (data.food!=0)?food:undefined
        })
    }).catch((err)=>{
        console.log("Failed to load data and display data in listing page" + err);
        res.render("foodListing",{
            title: "List of Meal Packages"
        })
    })
 });
 
 router.get("/foodListing/:name",(req,res)=>{

     if (req.params.name){ 
       data.getMealPackage(req.params.name)
       .then((mealPackage)=>{
         res.render("productDetail", {data:mealPackage.toJSON()}); 
       }).catch(()=>{
         console.log("couldn't find the package");
         res.redirect("/");
       });
     }
     else
       res.redirect("/students");
  });
 


module.exports = router;