module.exports = {
    shopItems: {
        1001: {
            name: "D20",
            category: ["object"],
            description: "It's a D20. It's pretty shiny!",
            cost: 5000,
            addToInventory: true,
            scripts: {
                onBuy: function(userData) {
                    console.log(this)
                },
                generateMetadata: function() {
                    return {colour:  Math.random() < 0.5 ? "White" : "Black"}
                }
            }
        },
        9991: {
            name: "Money sink",
            category: ["testing"],
            description: "TESTING ITEM: Deletes $20 from your wallet, and does nothing else",
            cost: 2000,
            addToInventory: false,
            scripts: {
                onBuy: function(userData) {
                    console.log(this)
                }
            }
        },
        9992: {
            name: "Bank Note",
            category: ["testing"],
            description: "Gives you money",
            cost: 0,
            addToInventory: false,
            scripts: {
                onBuy: function(userData) {
                    userData.moneyOnHand += 2000
                }
            }
        },
        9993: {
            name: "Large Bank Note",
            category: ["testing"],
            description: "Gives you a lot of money",
            cost: 0,
            addToInventory: false,
            scripts: {
                onBuy: function(userData) {
                    userData.moneyOnHand += 9999999
                }
            }
        }
    }
}