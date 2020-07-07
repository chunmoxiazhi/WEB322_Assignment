
class ListingFood{
    listingFood = [];
    constructor(){
        this.listingFood.push({top: true, category: "Weight Control", number_meals: 15, name: "Weight Loss Package", price: "$127", description: "High protein, low-calorie meals with a nutrient profile tuned for weight loss", image: "WEIGHTLOSS.jpg"});
        this.listingFood.push({top: true, category: "Enhance Muscle", number_meals: 16, name: "Muscle Gain Package", price: "$135", description: "Higher protein and calorie portions to support your muscle gain momentum", image: "MUSCLEGAIN.jpg"});
        this.listingFood.push({top: false, category: "Weight Control", number_meals: 12, name: "Keto Package", price: "$142", description: "High fat, low carb meals with moderate protein to achieve and sustain ketosis", image: "KETO.jpg"});
        this.listingFood.push({top: true, category: "Weight Control", number_meals: 13, name: "Fat Burner Package", price: "$118", description: "Low carb, nutrient-rich meals with fat-burning profiles to support fat loss", image: "FATBURNER.jpg"});
    }
};

module.exports = ListingFood;