const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const nodeEmailer = require('nodemailer');
const MongoClient = require('mongodb').MongoClient;
const Server = require('mongodb').Server;



let Schema = mongoose.Schema;

let userSchema = new Schema({
    first: String,
    last: String,
    email: String,
    password: String,
    clerk: Boolean
})

let homeFoodSchema = new Schema({
   
    code: String,
    name: String,
    price: Number, // 
    image: String
}, { collection : 'homeFood' })
let listingFoodSchema = new Schema({
    top: Boolean,
    category: String,
    number_meals: Number,
    name: String,
    price: Number,
    description: String,
    image: String
}, { collection : 'listingFood' })

let Users;
let UserDB;
let HomeFood;
let ListingFood;

let transporter = nodeEmailer.createTransport({

    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_ACCOUNT, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
});

module.exports.getHomeFood = function(){
    return new Promise((resolve, reject)=>{
        HomeFood.find()
        .exec()
        .then((availableHomeFood)=>{
            resolve(availableHomeFood.map(item=>item.toObject()));
        }).catch((err)=>{
            console.log("Failed to import homeFood from MongoDB" + err);
            reject(err);
        });
    });
}
module.exports.getListingFood = function(){
    return new Promise((resolve, reject)=>{
        ListingFood.find()
        .exec()
        .then((availableListingFood)=>{
            resolve(availableListingFood.map(item=>item.toJSON()));
        }).catch((err)=>{
            console.log("Failed to import ListingFood from MongoDB" + err);
            reject(err);
        });
    });
}

module.exports.initialize = function(){
    return new Promise((resolve, reject)=>{
        let db = mongoose.createConnection(process.env.MONGODB,{ useNewUrlParser: true, useUnifiedTopology: true });
        db.on('error', err=>{
            console.log("Initialize function CANNOT connect to the db");
            reject(err);
        })
        db.once('open',()=>{
            Users = db.model("users", userSchema);
            HomeFood = db.model("homeFood", homeFoodSchema);
            ListingFood = db.model("listingFood", listingFoodSchema);
            resolve();
        })
    });
}
module.exports.readFromMongo = function(){
      return new Promise((resolve, reject)=>{
             //let mongoClient = new MongoClient(new Server('localhost', process.env.PORT));
              MongoClient.connect(process.env.MONGODB, function(err, database) {
                  if(err){
                      console.log("Some error with reading from MONGO CLIENT");
                      reject(err);
                  }
                  else{
                     UserDB = database.db('web322_assignment');
                     UserDB.collection("users").find().toArray(function(err, result) {
                        if (err) throw err;
                        database.close();
                      });
                     resolve();
                  }
               
              });
      })
    
  }


module.exports.addUser = function(data){
    return new Promise((resolve, reject)=>{
        data.clerk = (data.clerk) ? true : false;

        let newUser = new Users({
            first: data.first,
            last: data.last,
            email: data.email,
            password: data.password,
            clerk: data.clerk
        });
        bcrypt.genSalt(10)
        .then(salt=>bcrypt.hash(newUser.password, salt))
        .then(hash=>{
            newUser.password = hash;
            newUser.save((err)=>{
                if(err){
                    console.log("Failed to add new user");
                    reject("Failed to add new user" + err);
                }
                else{
                    Users = mongoose.model("web322_assignment", userSchema);
                    console.log("Succesfully add new user!");
                    resolve();
                }
            })
        }).catch((err)=>{
            console.log("AddUser function caught some error");
            reject(err);
        })
    });
}


module.exports.getEmail = function(inEmail){
    return new Promise((resolve, reject)=>{
 
        Users.find({email: inEmail})
        .exec()
        .then((returnedUser)=>{
            if(returnedUser.length > 0){
                resolve(returnedUser[0]);
            }
            else{
                returnedUser.message="No User Found"
                reject(returnedUser);
            }
        }).catch((err)=>{
            console.log("getEmail function caught error");
            reject(err);
        });
    });
}

module.exports.validateUser = (inputs)=>{
    return new Promise((resolve, reject)=>{
        validateEmailPass(inputs)
        .then((inputs)=>{
            this.getEmail(inputs.email)
            .then((returnUser)=>{
                bcrypt.compare(inputs.password, returnUser.password).then((result) => {
                    if (result){
                        //for added security is return a student object w/o password
                        resolve(returnUser);
                        //resolve and pass the user back
                    }
                    else{
                        returnUser.message = "password don't match";
                        reject(returnUser);
                        return;
                        //reject pass error
                    }
                    // result === true
                });

            }).catch((err)=>{
                reject(err);
                return;
            });
        }).catch((err)=>{
            reject(err);
            return;
        });
    }).catch((err)=>{
        reject(err);
        return;
    });
}

module.exports.validateRegister = (inputs)=>{

    return new Promise((resolve, reject)=>{
        validateEmailPass(inputs).then((inputs)=>{
            if(inputs.first != "" && inputs.last != ""){
                console.log("Validating Registration!");
                if(inputs.password == inputs.confirmPassword){
                    console.log("Passed validation");
                    const msg = {
                        to:`${inputs.email}` ,
                        from: `xxiao22@myseneca.ca`,
                        subject: 'Welcome to Shilee\'s Food Truck',
                        text: 'Hello',
                        html: `Hello ${inputs.first} ${inputs.last}!
                                Welcome to Shilee\'s Food Truck! `,
                    };
                    console.log(msg);
                    transporter.sendMail(msg,function(error, info){
                        console.log("Sending email!");
                        if(error){
                            console.log(error);
                        }
                        else{
                            console.log("Successfully sent!");
                        }
                    });
                    resolve(inputs);
                }
                else{
                    inputs.message = "Password and confirmed password need to be identical!";
                    inputs.first = null;
                    inputs.last = null;
                    reject(inputs);
                }
            }
            else{
                inputs.message = "First name and last name cannot be empty!";
                reject(inputs);
            }
        }).catch((inputs)=>{
            reject(inputs);
        })
    })
}

validateEmailPass = function(data){
    return new Promise((resolve,reject)=>{
        var flag=true;
        let emailReg = /[^@]+@[^\.]+\..+/;
        let passReg = /^[0-9a-zA-Z@#$][0-9a-zA-Z@#$][0-9a-zA-Z@#$]+$/;
        if (!data.email||data.email ==""){
            flag = false;
            data.email = null;
            data.message ="Incorrect Email";
        }
        else if (!data.password||data.password==""){
            flag = false;
            data.password = null;
            data.message ="Incorrect Password";
        }
        else if (!passReg.test(data.password)){
            flag = false;
            data.password = null;
            data.message ="Password should be alpha numeric or !@#$";
        }
        else if (!emailReg.test(data.email)){
            flag = false;
            data.email = null;
            data.message ="Incorrect email format";
        }
        if (flag){
            resolve(data);
        }
        else{
            reject(data);
        }

    });
}

module.exports.addMeal = function(inputs){
    return new Promise((resolve, reject)=>{
        inputs.top = (inputs.top)? true: false;

        for(let i in inputs){
            if(inputs[i] == ""){
                inputs[i] = null;
            }
        }

        let newMealPack = new ListingFood({
            top: inputs.top,
            category: inputs.category,
            number_meals: inputs.number_meals,
            name: inputs.name,
            price: inputs.description,
            image: inputs.image
        });
        newMealPack.save((err)=>{
            if(err){
                console.log("Failed to save the new meal package" + err);
                reject(err);
            }
            else{
                console.log("Sccuessfully add meal package");
                resolve();
            }
        })
    }).catch((err)=>{
        console.log("Something wrong with add Meal" + err);
        reject("Not adding any meal package")
    })
}

module.exports.editMealPackages = (edition)=>{
    return new Promise((resolve, reject)=>{
        console.log(`IM IN EDITMEALPACKAGES ---> ${edition.name}`);
        edition.top = (edition.top)?true:false;
        ListingFood.updateOne(
            {name: edition.name},
            {
                $set:{
                    category: edition.category,
                    number_meals: edition.number_meals,
                    price: edition.price,
                    top: edition.top,
                    description: edition.description,
                    image: edition.image
                }
            }
        )
        .exec()
        .then(()=>{
            console.log(`Made change to ${edition.category}`);
            console.log("Successful update of meal package");
            resolve();
        }).catch((err)=>{
            console.log("Failed to update meal--->" + err);
            reject(err);
        });
    }).catch((error)=>{
        console.log("(Promise) Failed to update meal--->" + error);
        reject(error);
    })
}

module.exports.getMealPackage = function(mealName){
    return new Promise((resolve,reject)=>{
        ListingFood.findOne({name: mealName}) //gets all and returns an array. Even if 1 or less entries
        .exec() //tells mongoose that we should run this find as a promise.
        .then((returnedStudent)=>{
                resolve(returnedStudent);
        }).catch((err)=>{
                console.log("Error Retriving students:"+err);
                reject(err);
        });
    });
}
//start off with the cart empty. 
let userCart = [];
module.exports.cleanCart = ()=>{
    return new Promise((resolve, reject)=>{
        userCart = [];
        resolve(userCart);
    });
}
//adds a item from systems to the cart
module.exports.addItem = (inItem)=>{
    return new Promise((resolve,reject)=>{
        ListingFood.findOne({name: inItem.name}) //gets all and returns an array. Even if 1 or less entries
        .exec() //tells mongoose that we should run this find as a promise.
        .then((item)=>{
            userCart.push(item.toJSON());
            resolve(userCart.length);
        }).catch((err)=>{
        console.log("Failed to addItem ----------->" + err);
        reject(err);
        });
    });
}

//removes an item from the cart
module.exports.removeItem = (inItem)=>{
    return new Promise((resolve,reject)=>{
        console.log("Remove this Item------>" + inItem);
        for(var i = 0; i< userCart.length; i++){
            if(userCart[i].name == inItem){
                userCart.splice(i,1);
                i = userCart.length;
            }
        }
        resolve();
    });
}


//returns the cart array and all items
module.exports.getCart = ()=>{
    return new Promise((resolve, reject)=>{
            resolve(userCart);
    });
}

//calculates the price of all items in the cart
module.exports.checkout = ()=>{
    return new Promise((resolve, reject)=>{
        var price=0;//if check if car is empty
        if(userCart){
            userCart.forEach(x => {
                price += x.price;
            });
        }
        resolve(price);
    });
}

module.exports.confirmationEmail = (user)=>{
    return new Promise((resolve, reject)=>{
        //console.log("Im in confirmationEmail ------->" + user.email);
        console.log(process.env);
        let str ="", totalPrice = 0;
        userCart.forEach(meal=>{
            str += `Meal Package: ${meal.name} <br>
            Meal Price: ${meal.price}<br> `
            totalPrice += meal.price;
        });
        const msg = {
            to:`${user.email}` ,
            from: `xxiao22@myseneca.ca`,
            subject: 'Confirmation of Your Recent Shilee\' Food Truck Order',
           // text: 'Hello',
            html: `Hello ${user.first} ${user.last}!  <br>
                    Thank you for your order with Shilee\'s Food Truck!  <br>
                    Here is a confirmation of your order <br>
                    ${str}
                    Total Amount: ${totalPrice}`
        };



        console.log(msg);
        transporter.sendMail(msg,function(error, info){
            console.log("Sending email!");
            if(error){
                console.log(error);
            }
            else{
                console.log("Successfully sent!");
               
            }
            resolve();
        });
        
    }).catch((err)=>{
        console.log("Something wrong with confirmationEmail: " + err)
        reject(err);
    })
   
}
