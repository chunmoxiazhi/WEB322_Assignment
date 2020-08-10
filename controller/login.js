
const express = require('express');
const data = require("./data.js");

const router = express.Router();

const homeContent = require("../model/homeContent.js");
const listingFood = require("../model/listingFood.js");


//Login





// router.get("/user", (req, res)=>{
//     //if (req.query.email){
//         data.getEmail(req.query.email).then((info)=>{
//           res.render("user",{user: (info.length!=0)?info:undefined});
//         }).catch((err)=>{
//           res.render("students"); //add an error message or something
//           console.log("Invalid User info");
//         });
    //  }
    //   else{
    //   db.getStudents().then((data)=>{
    //     res.render("students",{students: (data.length!=0)?data:undefined});
    //   }).catch((err)=>{
    //     res.render("students"); //add an error message or something
    //   });
    //   }

//});

// function ensureLogin(req, res, next) {
//     if (!req.session.user) {
//       res.redirect("/login");
//     } 
//     else {
//       next();
//     }
//   }


module.exports = router;
