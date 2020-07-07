class HomeContent{

    homeContent = [];
    constructor(){
        this.homeContent.push({code: "pick", name: "Pick", description: "Over 100 healthy dishes", image: "pick.gif"});
        this.homeContent.push({code: "heat", name: "Heat", description: "Fine Cooked and Delivered", image: "heat.gif"});
        this.homeContent.push({code: "eat", name: "Eat", description: "Enjoy the taste and nutrious", image: "eat.gif"});
        this.homeContent.push({code: "repeat", name: "Repeat", description: "Free to skip or cancel", image: "repeat.gif"});
    }

}

module.exports = HomeContent;