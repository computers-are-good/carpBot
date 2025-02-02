const path = require('node:path');
const economyUtils = require(path.join(__dirname, "../utils/economy"));
const {gainExp} =  require(path.join(__dirname, "../utils/levelup"));
const { grantEffect, hasEffect } = require(path.join(__dirname, "../utils/effects"));
const scriptingUtils = require(path.join(__dirname, "../utils/scripting"));
const dungeonUtils = require(path.join(__dirname, "../utils/dungeon"));
/* 
{
    name: Name of the item that will be displayed in /shop and /inventory,
    category: List the categories the item belongs to:
        - All items should have the "object" category
        - If an item has a "consumable" category, the quantity will decrease by 1 when it is used.
        - If an item has a "testing" category, it can only be brought by admins.
        - Other categories, like "income" can be listed to better help users find the items.
    displayInInventory: if set to false, the item will not be displayed when /inventory is used.
    displayInShop: if set to false, the item will not be displayed in the shop when /shop is used.
    cost: the cost of the item in cents,
    sellMultiplier: the cost * sellMultiplier = money made during a sale (default: 0.5)
    canSell: can we sell the item? (default: true)
    metadataToDisplay: The metadata tags in this array will be displayed when /inventory is used.
    emoji: the emoji representing the data which will be added before the item name in /shop and /inventory
    oneOff: if set to true, crapbot will only allow the item to be brought once (default: false)
    addToInventory: if set to false, the item will not be added to the user's inventory
    scripts:
        - generateMetadata: generates the metadata of an item to be stored in the inventory.
        - onUse: is ran when the item is used.
        - onBuy: is ran when the item is brought.
        - canBuy: Can the user buy this item?
}
*/
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
            displayInShop: true,
            scripts: {
                generateMetadata: function () {
                    return { Colour: Math.random() < 0.5 ? "White" : "Black" }
                },
                onUse: function (userInfo, metadata) {
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
            displayInShop: true,
            scripts: {
                generateMetadata: function () {
                    return { Colour: Math.random() < 0.5 ? "White" : "Black" }
                },
                onUse: function (userInfo, metadata) {
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
            displayInShop: true,
            scripts: {
                generateMetadata: function () {
                    return { Colour: Math.random() < 0.5 ? "White" : "Black" }
                },
                onUse: function (userInfo, metadata) {
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
            displayInShop: true,
            scripts: {
                generateMetadata: function () {
                    return { Colour: Math.random() < 0.5 ? "White" : "Black" }
                },
                onUse: function (userInfo, metadata) {
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
            displayInShop: true,
            scripts: {
                generateMetadata: function () {
                    return { Colour: Math.random() < 0.5 ? "White" : "Black" }
                },
                onUse: function (userInfo, metadata) {
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
            displayInShop: true,
            scripts: {
                generateMetadata: function () {
                    return { Colour: Math.random() < 0.5 ? "White" : "Black" }
                },
                onUse: function (userInfo, metadata) {
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
            displayInShop: true,
            scripts: {
                onUse: function (userInfo, metadata) {
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
            canSell: false,
            metadataToDisplay: ["Address"],
            emoji: "🏠",
            oneOff: false,
            addToInventory: true,
            displayInShop: true,
            scripts: {
                generateMetadata: function () {
                    return {
                        lastCollected: new Date().getTime(),
                        level: 1,
                        Address: `${Math.ceil(Math.random() * 5000)} ${scriptingUtils.choice(["Clozer Drive", "Moon Street", "Heaven Road"])}`
                    }
                }
            }
        },
        1009: {
            name: "Degree",
            category: ["object", "income"],
            displayInInventory: false,
            description: "If only getting a degree was this simple in real life! Buy this to earn an extra $50 when working.",
            cost: 888800,
            canSell: false,
            metadataToDisplay: ["subject"],
            emoji: "📄",
            oneOff: true,
            addToInventory: true,
            displayInShop: true,
            scripts: {
                generateMetadata: function () {
                    return {
                        subject: "Psychology"
                    }
                },
                canBuy: function (userInfo) {
                    let messagesToUser;
                    if (userInfo.level < 10 || userInfo.lifetimeMoneyFromWorking < 500000) {
                        if (userInfo.level < 10) {
                            messagesToUser += "You must be level 10 or above to buy this item. "
                        }
                        if (userInfo.lifetimeMoneyFromWorking < 500000) {
                            messagesToUser += `You must have earned at least $5,000 from working before buying this (you have earned ${economyUtils.formatMoney(userInfo.lifetimeMoneyFromWorking)})`
                        }
                        return {
                            canBuy: false,
                            messageToUser: messagesToUser
                        }
                    }

                    return {
                        canBuy: true
                    }
                }
            }
        },
        1010: {
            name: "Adventurer's boots",
            canSell: false,
            category: ["object", "income"],
            displayInInventory: false,
            description: "Buy these boots to go on epic adventures in dungeons!",
            cost: 50000,
            metadataToDisplay: [""],
            emoji: "🥾",
            oneOff: true,
            addToInventory: true,
            displayInShop: true,
            scripts: {
                canBuy: function (userInfo) {
                    if (userInfo.level < 2) {
                        return {
                            canBuy: false,
                            messageToUser: "You must be level 3 or above to buy this item."
                        }
                    }
                    return {
                        canBuy: true
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
            canSell: false,
            oneOff: false,
            addToInventory: true,
            displayInShop: true,
            scripts: {
                onUse: function (userInfo, metadata) {
                    let won = Math.random() < 0.1;
                    if (won) {
                        userInfo.moneyOnHand += 2000;
                    }
                    return {
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
            displayInShop: true,
            scripts: {
                onUse: function (userInfo, metadata) {
                    grantEffect(userInfo, "coffee", 60);
                    return {
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
            cost: 149900,
            emoji: "🧋",
            oneOff: false,
            addToInventory: true,
            displayInShop: true,
            scripts: {
                onUse: function (userInfo, metadata) {
                    return {
                        messageToUser: gainExp(userInfo, 250)
                    }
                }
            }
        },
        2006: {
            name: "Medium EXP Potion",
            displayInInventory: true,
            category: ["object", "consumable"],
            description: "Gain 2500 exp.",
            cost: 999900,
            emoji: "🧋",
            oneOff: false,
            addToInventory: true,
            displayInShop: true,
            scripts: {
                onUse: function (userInfo, metadata) {
                    return {
                        messageToUser: gainExp(userInfo, 2500)
                    }
                }
            }
        },
        2007: {
            name: "Large EXP Potion",
            displayInInventory: true,
            category: ["object", "consumable"],
            description: "Gain 10000 exp.",
            cost: 1999900,
            emoji: "🧋",
            oneOff: false,
            addToInventory: true,
            displayInShop: true,
            scripts: {
                onUse: function (userInfo, metadata) {
                    return {
                        messageToUser: gainExp(userInfo, 10000)
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
            displayInShop: true,
            scripts: {
                onUse: function (userInfo, metadata) {
                    grantEffect(userInfo, "greenTea", 60);
                    return {
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
            displayInShop: true,
            scripts: {
                onUse: function (userInfo, metadata) {
                    grantEffect(userInfo, "redTea", 60);
                    return {
                        messageToUser: "You drank some red tea."
                    }
                }
            }
        },
        2011: {
            name: "Apple",
            displayInInventory: true,
            category: ["object", "consumable", "healing"],
            description: "Gain 20 health",
            cost: 20000,
            emoji: "🍎",
            oneOff: false,
            addToInventory: true,
            displayInShop: true,
            scripts: {
                onUse: function (userInfo, metadata) {
                    userInfo.combat.health += 20;
                    if (userInfo.combat.health > userInfo.combat.maxHealth + userInfo.level * 5) userInfo.combat.health = userInfo.combat.maxHealth + userInfo.level * 5;
                    return {
                        messageToUser: `Healed for 20 HP. You are now on ${userInfo.combat.health} HP.`
                    }
                }
            }
        },
        2012: {
            name: "Attack potion",
            displayInInventory: true,
            category: ["object", "consumable",],
            description: "Increases your attack by 1.",
            emoji: "🧪",
            oneOff: false,
            addToInventory: true,
            displayInShop: false,
            scripts: {
                canBuy: _ => false,
                onUse: function (userInfo, metadata) {
                    userInfo.combat.attack += 1;
                    return {
                        messageToUser: `Increased attack from ${userInfo.combat.attack - 1} to ${userInfo.combat.attack}.`
                    }
                }
            }
        },
        2013: {
            name: "Block potion",
            displayInInventory: true,
            category: ["object", "consumable",],
            description: "Increases your block by 1.",
            emoji: "🧪",
            oneOff: false,
            addToInventory: true,
            displayInShop: false,
            scripts: {
                canBuy: _ => false,
                onUse: function (userInfo, metadata) {
                    userInfo.combat.block += 1;
                    return {
                        messageToUser: `Increased block from ${userInfo.combat.block - 1} to ${userInfo.combat.block}.`
                    }
                }
            }
        },
        3001: {
            name: "Blade of Monella",
            displayInInventory: true,
            emoji: "🗡️",
            canSell: false,
            category: ["object", "raid"],
            addToInventory: true,
            displayInShop: false,
            description: "Gives you a 1% chance of doublestrike (attack the enemy twice on one turn)",
            scripts: {
                canBuy: _ => false,
                onUse: function(userData) {
                    dungeonUtils.addCombatProbability(userData, "doublestrike", 0.01)
                    return {
                        messageToUser: `Doublestrike chance increased (${(userData.combat.probabilities.doublestrike - 0.01) * 100}% -> ${userData.combat.probabilities.doublestrike * 100}%).`
                    };
                }
            }
        },
        3002: {
            name: "Flask of Tratlus",
            displayInInventory: true,
            displayInShop: false,
            emoji: "⚗️",
            canSell: false,
            category: ["object", "raid"],
            addToInventory: true,
            description: "Gives you a 0.5% chance of totalblock (negates damage for one turn)",
            scripts: {
                canBuy: _ => false,
                onUse: function(userData) {
                    dungeonUtils.addCombatProbability(userData, "totalblock", 0.005)
                    return {
                        messageToUser: `Totalblock chance increased (${(userData.combat.probabilities.totalblock - 0.005) * 100}% -> ${userData.combat.probabilities.totalblock * 100}%).`
                    };
                }
            }
        },
        3003: {
            name: "Meat of the Underworld",
            displayInInventory: true,
            displayInShop: false,
            emoji: "🍗",
            canSell: false,
            category: ["object", "raid"],
            addToInventory: true,
            description: "Permanently increases your attack by 35.",
            scripts: {
                canBuy: _ => false,
                onUse: function(userData) {
                    userData.combat.attack += 35;
                    return {
                        messageToUser: `Increased attack (${userData.combat.attack - 35} -> ${userData.combat.attack})`
                    };
                }
            }
        },
        3011: {
            name: "Elusive red rose",
            displayInInventory: true,
            displayInShop: true,
            emoji: "🌹",
            category: ["object", "unwitheringflower"],
            addToInventory: true,
            unwitheringFlowers: 5,
            description: "When used, for the next five minutes, deal damage equal to 25% of the enemy's health in non-raid battles.",
            scripts: {
                onUse: function(userInfo) {
                    grantEffect(userInfo, "redrose", 300);
                    return {
                        messageToUser: "Elusive red rose activated."
                    }
                }
            }
        },
        9911: {
            name: "Money sink",
            category: ["testing"],
            displayInInventory: false,
            description: "TESTING ITEM: Deletes $20 from your wallet, and does nothing else",
            cost: 2000,
            addToInventory: false,
            scripts: {
                onBuy: function(userData) {
                    userData.moneyOnHand -= 2000;
                }
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
                onBuy: function (userData) {
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
                onBuy: function (userData) {
                    userData.moneyOnHand += 9999999
                }
            }
        }
    }
}