module.exports = {
    shopItems: {
        1001: {
            name: "D20",
            category: ["object"],
            description: "It's a D20. It's pretty shiny!",
            cost: 500,
            emoji: "🎲",
            oneOff: true,
            addToInventory: true,
            scripts: {
                onBuy: function(userData) {
                    console.log(this)
                },
                generateMetadata: function() {
                    return {colour:  Math.random() < 0.5 ? "White" : "Black"}
                },
                onUse: function(userInfo, metadata) {
                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: `The ${metadata.colour} D20 rolled a ${Math.ceil(Math.random() * 20)}`
                    }
                }
            }
        },
        1002: {
            name: "D12",
            category: ["object"],
            description: "It's a D12. It's pretty shiny!",
            cost: 500,
            emoji: "🎲",
            oneOff: true,
            addToInventory: true,
            scripts: {
                onBuy: function(userData) {
                    console.log(this)
                },
                generateMetadata: function() {
                    return {colour:  Math.random() < 0.5 ? "White" : "Black"}
                },
                onUse: function(userInfo, metadata) {
                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: `The ${metadata.colour} D12 rolled a ${Math.ceil(Math.random() * 12)}`
                    }
                }
            }
        },
        1003: {
            name: "D10",
            category: ["object"],
            description: "It's a D10. It's pretty shiny!",
            cost: 500,
            oneOff: true,
            emoji: "🎲",
            addToInventory: true,
            scripts: {
                onBuy: function(userData) {
                    console.log(this)
                },
                generateMetadata: function() {
                    return {colour:  Math.random() < 0.5 ? "White" : "Black"}
                },
                onUse: function(userInfo, metadata) {
                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: `The ${metadata.colour} D10 rolled a ${Math.ceil(Math.random() * 10)}`
                    }
                }
            }
        },
        1004: {
            name: "D8",
            category: ["object"],
            description: "It's a D8. It's pretty shiny!",
            cost: 500,
            emoji: "🎲",
            oneOff: true,
            addToInventory: true,
            scripts: {
                onBuy: function(userData) {
                    console.log(this)
                },
                generateMetadata: function() {
                    return {colour:  Math.random() < 0.5 ? "White" : "Black"}
                },
                onUse: function(userInfo, metadata) {
                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: `The ${metadata.colour} D8 rolled a ${Math.ceil(Math.random() * 8)}`
                    }
                }
            }
        },
        1005: {
            name: "D6",
            category: ["object"],
            description: "It's a D6. It's pretty shiny!",
            cost: 500,
            emoji: "🎲",
            oneOff: true,
            addToInventory: true,
            scripts: {
                onBuy: function(userData) {
                    console.log(this)
                },
                generateMetadata: function() {
                    return {colour:  Math.random() < 0.5 ? "White" : "Black"}
                },
                onUse: function(userInfo, metadata) {
                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: `The ${metadata.colour} D6 rolled a ${Math.ceil(Math.random() * 6)}`
                    }
                }
            }
        },
        1006: {
            name: "D4",
            category: ["object"],
            description: "It's a D4. It's pretty shiny!",
            cost: 500,
            oneOff: true,
            emoji: "🎲",
            addToInventory: true,
            scripts: {
                onBuy: function(userData) {
                    console.log(this)
                },
                generateMetadata: function() {
                    return {colour:  Math.random() < 0.5 ? "White" : "Black"}
                },
                onUse: function(userInfo, metadata) {
                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: `The ${metadata.colour} D4 rolled a ${Math.ceil(Math.random() * 4)}`
                    }
                }
            }
        },
        1007: {
            name: "Coin",
            category: ["object"],
            description: "Flip a coin!",
            cost: 100,
            emoji: "🪙",
            oneOff: true,
            addToInventory: true,
            scripts: {
                onUse: function(userInfo, metadata) {
                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: Math.random() < 0.5 ? "Heads" : "Tails"
                    }
                }
            }
        },
        2001: {
            name: "Scratch ticket",
            category: ["object", "consumable"],
            description: "10% Chance to give you $20",
            cost: 300,
            emoji: "🎫",
            oneOff: false,
            addToInventory: true,
            scripts: {
                onUse: function(userInfo, metadata) {
                    let won = Math.random() < 0.1;
                    if (won) {
                        userInfo.moneyOnHand += 2000;
                    }
                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: won ? "You won $20" : "Better learn gambling isn't a good way to make money... You lost."
                    }
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
            emoji: "💀",
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
            emoji: "💀",
            addToInventory: false,
            scripts: {
                onBuy: function(userData) {
                    userData.moneyOnHand += 9999999
                }
            }
        }
    }
}