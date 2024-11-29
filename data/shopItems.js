const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../utils/economy"));
const {grantEffect} = require(path.join(__dirname, "../utils/grantEffect.js"))
const scriptingUtils = require(path.join(__dirname, "../utils/scripting"));
const {calculateLevelUp} = require(path.join(__dirname, "../utils/calculateLevelUp"));

module.exports = {
    shopItems: {
        1001: {
            name: "D20",
            category: ["object"],
            displayInInventory: true,
            description: "It's a D20. It's pretty shiny!",
            cost: 500,
            metadataToDisplay: ["Colour"],
            emoji: "🎲",
            oneOff: true,
            addToInventory: true,
            scripts: {
                generateMetadata: function() {
                    return {Colour:  Math.random() < 0.5 ? "White" : "Black"}
                },
                onUse: function(userInfo, metadata) {
                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: `The ${metadata.Colour} D20 rolled a ${Math.ceil(Math.random() * 20)}`
                    }
                }
            }
        },
        1002: {
            name: "D12",
            category: ["object"],
            displayInInventory: true,
            description: "It's a D12. It's pretty shiny!",
            cost: 500,
            emoji: "🎲",
            metadataToDisplay: ["Colour"],
            oneOff: true,
            addToInventory: true,
            scripts: {
                generateMetadata: function() {
                    return {Colour:  Math.random() < 0.5 ? "White" : "Black"}
                },
                onUse: function(userInfo, metadata) {
                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: `The ${metadata.Colour} D12 rolled a ${Math.ceil(Math.random() * 12)}`
                    }
                }
            }
        },
        1003: {
            name: "D10",
            category: ["object"],
            displayInInventory: true,
            description: "It's a D10. It's pretty shiny!",
            cost: 500,
            oneOff: true,
            metadataToDisplay: ["Colour"],
            emoji: "🎲",
            addToInventory: true,
            scripts: {
                generateMetadata: function() {
                    return {Colour:  Math.random() < 0.5 ? "White" : "Black"}
                },
                onUse: function(userInfo, metadata) {
                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: `The ${metadata.Colour} D10 rolled a ${Math.ceil(Math.random() * 10)}`
                    }
                }
            }
        },
        1004: {
            name: "D8",
            category: ["object"],
            displayInInventory: true,
            description: "It's a D8. It's pretty shiny!",
            cost: 500,
            emoji: "🎲",
            metadataToDisplay: ["Colour"],
            oneOff: true,
            addToInventory: true,
            scripts: {
                generateMetadata: function() {
                    return {Colour:  Math.random() < 0.5 ? "White" : "Black"}
                },
                onUse: function(userInfo, metadata) {
                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: `The ${metadata.Colour} D8 rolled a ${Math.ceil(Math.random() * 8)}`
                    }
                }
            }
        },
        1005: {
            name: "D6",
            category: ["object"],
            displayInInventory: true,
            description: "It's a D6. It's pretty shiny!",
            cost: 500,
            emoji: "🎲",
            metadataToDisplay: ["Colour"],
            oneOff: true,
            addToInventory: true,
            scripts: {
                generateMetadata: function() {
                    return {Colour:  Math.random() < 0.5 ? "White" : "Black"}
                },
                onUse: function(userInfo, metadata) {
                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: `The ${metadata.Colour} D6 rolled a ${Math.ceil(Math.random() * 6)}`
                    }
                }
            }
        },
        1006: {
            name: "D4",
            category: ["object"],
            displayInInventory: true,
            description: "It's a D4. It's pretty shiny!",
            cost: 500,
            oneOff: true,
            metadataToDisplay: ["Colour"],
            emoji: "🎲",
            addToInventory: true,
            scripts: {
                generateMetadata: function() {
                    return {Colour:  Math.random() < 0.5 ? "White" : "Black"}
                },
                onUse: function(userInfo, metadata) {
                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: `The ${metadata.Colour} D4 rolled a ${Math.ceil(Math.random() * 4)}`
                    }
                }
            }
        },
        1007: {
            name: "Coin",
            category: ["object"],
            displayInInventory: true,
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
        1008: {
            name: "House",
            category: ["object", "income"],
            displayInInventory: false,
            description: "Buy a house and rent it out to earn some money on the side! Collect rent with `/collectrent`",
            cost: 5000000,
            metadataToDisplay: ["Address"],
            emoji: "🏠",
            oneOff: false,
            addToInventory: true,
            scripts: {
                generateMetadata: function() {
                    return {
                        lastCollected: new Date().getTime(),
                        level: 1,
                        Address: `${Math.ceil(Math.random() * 5000)} ${scriptingUtils.choice(["Clozer Drive", "Moon Street", "Heaven Road"])}`
                    }
                }
            }
        },
        2001: {
            name: "Scratch ticket",
            displayInInventory: true,
            category: ["object", "consumable"],
            description: "10% Chance to give you $20.",
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
        2002: {
            name: "Coffee",
            displayInInventory: true,
            category: ["object", "consumable"],
            description: "For the next 60 seconds, earn an additional $1.50 when you work.",
            cost: 1500,
            emoji: "☕",
            oneOff: false,
            addToInventory: true,
            scripts: {
                onUse: function(userInfo, metadata) {
                    userInfo = grantEffect(userInfo, "coffee", 60);
                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: "You drank coffee."
                    }
                }
            }
        },
        2005: {
            name: "Small EXP Potion",
            displayInInventory: true,
            category: ["object", "consumable"],
            description: "Gain 250 exp.",
            cost: 5000,
            emoji: "🧋",
            oneOff: false,
            addToInventory: true,
            scripts: {
                onUse: function(userInfo, metadata) {
                    let results = calculateLevelUp(userInfo.level, userInfo.expRequired, 250);
                    let outputString = ""
                    if (userInfo.level != results.newLevel) {
                        outputString = `Congratulations! Levelled up (${userInfo.level} -> ${results.newLevel})`;
                    }
                    userInfo.level = results.newLevel;
                    userInfo.expRequired = results.newExpRequired;

                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: outputString
                    }
                }
            }
        },
        2009: {
            name: "Green Tea",
            displayInInventory: true,
            category: ["object", "consumable"],
            description: "For the next 60 seconds, gain +20% EXP when you work.",
            cost: 2500,
            emoji: "🌿",
            oneOff: false,
            addToInventory: true,
            scripts: {
                onUse: function(userInfo, metadata) {
                    userInfo = grantEffect(userInfo, "greenTea", 60);
                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: "You drank some green tea."
                    }
                }
            }
        },
        2010: {
            name: "Red Tea",
            displayInInventory: true,
            category: ["object", "consumable"],
            description: "For the next 60 seconds, gain +300% EXP when you work.",
            cost: 20000,
            emoji: "🍁",
            oneOff: false,
            addToInventory: true,
            scripts: {
                onUse: function(userInfo, metadata) {
                    userInfo = grantEffect(userInfo, "redTea", 60);
                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: "You drank some red tea."
                    }
                }
            }
        },
        2010: {
            name: "Apple",
            displayInInventory: true,
            category: ["object", "consumable", "healing"],
            description: "Gain 20 health",
            cost: 20000,
            emoji: "🍎",
            oneOff: false,
            addToInventory: true,
            scripts: {
                onUse: function(userInfo, metadata) {
                    userInfo.combat.health += 20;
                    if (userInfo.combat.health > userInfo.combat.maxHealth + userInfo.level * 5) userInfo.combat.health = userInfo.combat.maxHealth + userInfo.level * 5;
                    return {
                        userInfo: userInfo,
                        metadata: metadata,
                        messageToUser: `Healed for 20 HP. You are now on ${userInfo.combat.health} HP.`
                    }
                }
            }
        },
        9991: {
            name: "Money sink",
            category: ["testing"],
            displayInInventory: false,
            description: "TESTING ITEM: Deletes $20 from your wallet, and does nothing else",
            cost: 2000,
            addToInventory: false,
            scripts: {
            }
        },
        9992: {
            name: "Bank Note",
            category: ["testing"],
            displayInInventory: false,
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
            displayInInventory: false,
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