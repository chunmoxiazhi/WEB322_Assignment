class HomeFood{

    homeFood = [];
    constructor(){
        this.homeFood.push({code: "shrimp", name: "Coconut Curry Shrimp", price: "$12.99", image: "Coconut_Curry_Shrimp.jpg"});
        this.homeFood.push({code: "salmon", name: "Garlic Butter Salmon", price: "$11.99", image: "Garlic_Butter_Salmon.jpg"});
        this.homeFood.push({code: "steak", name: "Keto Cheese Steak", price: "$10.99", image: "Keto_Cheese_Steak.jpg"});
        this.homeFood.push({code: "chicken", name: "Pan Roast Mushroom Chicken", price: "$10.99", image: "Pan_Roast_Mushroom_Chicken.jpg"});
    }

}

module.exports = HomeFood;