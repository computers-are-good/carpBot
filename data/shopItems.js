const path = require('node:path');
const { gainExp } = require(path.join(__dirname, "../utils/levelup"));
const { grantEffect, hasEffect } = require(path.join(__dirname, "../utils/effects"));
const scriptingUtils = require(path.join(__dirname, "../utils/scripting"));
const {addCombatProbability} = require(path.join(__dirname, "../utils/combat"));
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
    addToInventory: if set to false, the item will not be added to the user's inventory once brought (default: false)
    scripts:
        - generateMetadata: generates the metadata of an item to be stored in the inventory.
        - onUse: is ran when the item is used.
        - onBuy: is ran when the item is brought.
        - canBuy: Can the user buy this item?
        - canUse: can we use this item?
        - getInteractionOptions: parameters which can be fed into onUse. Return {
            msg: Message to user,
            options: ["option 1", "option 2"...]
        }
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
                            messagesToUser += `You must have earned at least $5,000 from working before buying this (you have earned ${scriptingUtils.formatMoney(userInfo.lifetimeMoneyFromWorking)})`
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
            name: "Adventurer's map",
            canSell: false,
            category: ["object", "income"],
            displayInInventory: false,
            description: "Buy this map to go on epic adventures in dungeons!",
            cost: 50000,
            metadataToDisplay: [""],
            emoji: "🗺️",
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
            cost: 50000,
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
            cost: 400000,
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
            cost: 1500000,
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
            description: "For the next 60 seconds, gain +15% EXP when you work.",
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
            description: "For the next 60 seconds, gain +30% EXP when you work.",
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
                    if (userInfo.combat.health > userInfo.combat.maxHealth) userInfo.combat.health = userInfo.combat.maxHealth;
                    return {
                        messageToUser: `Healed for 20 HP. You are now on ${userInfo.combat.health} HP.`
                    }
                },
                canUse: function (userInfo, metadata) {
                    return userInfo.combat.health >= userInfo.combat.maxHealth ? {
                        canUse: false,
                        messageToUser: "Cannot use because you are already at max health"
                    } : {
                        canUse: true,
                        messageToUser: "You can use this item."
                    }
                }
            }
        },
        2012: {
            name: "Attack potion",
            displayInInventory: true,
            category: ["object", "consumable",],
            description: "Increases your attack by 1.",
            cost: 1000000,
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
            cost: 1000000,
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
        2014: {
            name: "Coin of fortune",
            displayInInventory: true,
            cost: 10000,
            category: ['object', "consumable"],
            description: "This can either give you $1000 or give you 250 EXP",
            emoji: "🪙",
            addToInventory: true,
            oneOff: false,
            displayInShop: false,
            scripts: {
                onUse: function (userInfo, metadata, optionChosen) {
                    if (optionChosen === "$1000") userInfo.moneyOnHand += 100000;
                    if (optionChosen === "250 EXP") gainExp(userInfo, 250);
                    return {
                        messageToUser: optionChosen === "$1000" ? `You gained $1000.` : gainExp(userInfo, 250)
                    }
                },
                canBuy: _ => false,
                getInteractionOptions: function (userInfo) {
                    return {
                        msg: "What would you like?",
                        options: ["$100", "250 EXP"],
                    }
                }
            }
        },
        2015: {
            name: "Pot of fortune",
            displayInInventory: true,
            category: ["object", "consumable"],
            description: "This can either give you $1000 or 2500 EXP",
            emoji: "🪙",
            addToInventory: true,
            oneOff: false,
            displayInShop: false,
            scripts: {
                onUse: function (userInfo, metadata, optionChosen) {
                    if (optionChosen === "$1000") userInfo.moneyOnHand += 100000;
                    let expStr
                    if (optionChosen === "2500 EXP") {
                        expStr = gainExp(userInfo, 2500);
                    }
                    return {
                        messageToUser: optionChosen === "$1000" ? `You gained $1000.` : expStr
                    }
                },
                canBuy: _ => false,
                getInteractionOptions: function (userInfo) {
                    return {
                        msg: "What would you like?",
                        options: ["$1000", "2500 EXP"],
                    }
                }
            }
        },
        2016: {
            name: "Potion of Knowledge",
            displayInInventory: true,
            oneOff: false,
            displayInShop: false,
            cost: 1000000,
            addToInventory: true,
            category: ["object", "consumable"],
            description: "Gain either 3000 EXP, or earn three times experience from working for 10 minutes",
            emoji: '⚗️',
            scripts: {
                getInteractionOptions: _ => {
                    return {
                        msg: "What would you like?",
                        options: ['3000 EXP', 'EXP Boost']
                    }
                 },
                 onUse: function(userInfo, metadata, optionChosen) {
                    let stringBack;
                    if (optionChosen === "3000 EXP") {
                        stringBack = gainExp(userInfo, 3000);
                    }
                    if (optionChosen === "EXP Boost") {
                        grantEffect(userInfo, "potionOfKnowledge", 600);
                        stringBack = "You will earn 3x EXP from working for the next 10 minutes."
                    }
                    return {
                        messageToUser: stringBack
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
                onUse: function (userData) {
                    addCombatProbability(userData, "doublestrike", 0.01)
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
            category: ["object", "raid", "consumable"],
            addToInventory: true,
            description: "Gives you a 0.5% chance of totalblock (negates damage for one turn)",
            scripts: {
                canBuy: _ => false,
                onUse: function (userData) {
                    addCombatProbability(userData, "totalblock", 0.005);
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
            category: ["object", "raid", "consumable"],
            addToInventory: true,
            description: "Permanently increases your attack by 35.",
            scripts: {
                canBuy: _ => false,
                onUse: function (userData) {
                    userData.combat.attack += 35;
                    return {
                        messageToUser: `Increased attack (${userData.combat.attack - 35} -> ${userData.combat.attack})`
                    };
                }
            }
        },
        3004: {
            name: "Sands lost to time",
            displayInInventory: true,
            displayInShop: false,
            description: "An condensed grain of dreams from deep within Goldiar's hoards. Should be sold for money.",
            emoji: "⌛",
            canSell: true,
            category: ["object", "raid", "sellable"],
            cost: 1000000,
            scripts: {
                canBuy: _ => false
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
                onUse: function (userInfo) {
                    grantEffect(userInfo, "redrose", 300);
                    return {
                        messageToUser: "Elusive red rose activated."
                    }
                }
            }
        },
        3012: {
            name: "Box of Treasures",
            displayInInventory: true,
            displayInShop: true,
            emoji: "🎁",
            addToInventory: true,
            category: ["object", "unwitheringflower"],
            unwitheringFlowers: 1,
            descriptions: "When used, gives you anywhere between $500,000 and $750,000",
            scripts: {
                onUse: function(userInfo) {
                    const moneyGained = Math.ceil(25000000 * Math.random()) + 50000000;
                    userInfo.moneyOnHand += moneyGained;
                    return {
                        messageToUser: `You gained ${scriptingUtils.formatMoney(moneyGained)}`
                    }
                }
            }
        },
        4001: {
            name: "Diamond",
            displayInInventory: true,
            displayInShop: false,
            addToInventory: true,
            emoji: "💎",
            category: ["object", "sellable"],
            description: "It looks shiny. It should be sold.",
            sellable: true,
            cost: 199900
        },
        4002: {
            name: "Jade",
            displayInInventory: true,
            displayInShop: false,
            addToInventory: true,
            emoji: "🪨",
            category: ["object", "sellable"],
            description: "It looks shiny. It should be sold.",
            sellable: true,
            cost: 99900
        },
        4003: {
            name: "Shiny Rock",
            displayInInventory: true,
            displayInShop: false,
            addToInventory: true,
            sellable: false,
            emoji:  "🪨",
            category: ["object", "sellable"],
            description: "Your pet found you this. It should be sold.",
            cost: 1000
        },
        4004: {
            name: "$10 banknote",
            displayInInventory: true,
            displayInShop: false,
            sellable: false,
            addToInventory: true,
            emoji: "💵",
            category: ["object", "consumable"],
            cost: 1000,
            description: "It's just $10. Gives you $10 when used.",
            scripts: {
                onUse: function(userInfo) {
                    userInfo.moneyOnHand += 1000
                }
            }
        },
        4005: {
            name: "$20 banknote",
            displayInInventory: true,
            displayInShop: false,
            sellable: false,
            addToInventory: true,
            emoji: "💵",
            category: ["object", "consumable"],
            cost: 1000,
            description: "It's just $20. Gives you $20 when used.",
            scripts: {
                onUse: function(userInfo) {
                    userInfo.moneyOnHand += 2000;
                }
            }
        },
        4006: {
            name: "$50 banknote",
            displayInInventory: true,
            displayInShop: false,
            sellable: false,
            addToInventory: true,
            emoji: "💵",
            category: ["object", "consumable"],
            cost: 1000,
            description: "It's just $50. Gives you $50 when used.",
            scripts: {
                onUse: function(userInfo) {
                    userInfo.moneyOnHand += 5000;
                }
            }
        },
        4007: {
            name: "Stick",
            displayInInventory: true,
            displayInShop: false,
            sellable: true,
            addToInventory: true,
            emoji: "🌿",
            cost: 100,
            description: "You can find this on the street. You should sell it.",
        },
        4008: {
            name: "Fish scales",
            displayInInventory: true,
            displayInShop: false,
            sellable: true,
            addToInventory: true,
            emoji: "🎏",
            cost: 5000,
            description: "Your fish gave this to you as a gift!"
        },
        4009: {
            name: "Rabbit's feet",
            displayInInventory: true,
            displayInShop: false,
            sellable: true,
            addToInventory: true,
            emoji: "🐇",
            cost: 50000,
            description: "Rabbit :)"
        },
        4010: {
            name: "Snake Scale",
            displayInInventory: true,
            displayInShop: false,
            sellable: true,
            addToInventory: true,
            emoji: "🐍",
            cost: 15000,
            description: "Your snake shredded this."
        },
        5001: {
            name: "Wooden Sword",
            displayInInventory: true,
            displayInShop: true,
            addToInventory: true,
            emoji: "⚔️",
            category: ["object", "equipment"],
            cost: 10000,
            description: "It ain't much, but it's better than nothing. +3 to attack when equipped."
        },
        5002: {
            name: "Leather Armor",
            displayInInventory: true,
            displayInShop: true,
            addToInventory: true,
            emoji: "👚",
            category: ["object", "equipment"],
            cost: 20000,
            description: "At least it's light. +3 to block when equipped."
        },
        5003: {
            name: "Running Shoes",
            displayInInventory: true,
            displayInShop: true,
            addToInventory: true,
            emoji: "👞",
            category: ["object", "equipment"],
            cost: 10000,
            description: "You can buy this anywhere. +1 to speed and +1 to block when equipped."
        },
        5004: {
            name: "Stone Sword",
            displayInInventory: true,
            displayInShop: true,
            addToInventory: true,
            emoji: "⚔️",
            category: ["object", "equipment"],
            cost: 20000,
            description: "It's bad and clunky. +5 to attack when equipped."
        },
        5010: {
            name: "Iron sword",
            displayInInventory: true,
            displayInShop: true,
            addToInventory: true,
            emoji: "🗡️",
            category: ["object", "equipment"],
            cost: 150000,
            description: "It's a perfectly average sword. +10 to attack when equipped."
        },
        5011: {
            name: "Chainmail Armour",
            displayInInventory: true,
            category: ["object", "equipment"],
            displayInShop: true,
            addToInventory: true,
            emoji: "🧥",
            cost: 200000,
            description: "The local scrapyard connected their spare rusty chains around in the vague approxmiation of armour. +6 to block when equipped."
        },
        5012: {
            name: "Iron armour",
            displayInInventory: true,
            category: ["object", "equipment"],
            displayInShop: true,
            addToInventory: true,
            emoji: "🧥",
            cost: 500000,
            description: "Forged at the one and only remaining local blacksmith. +15 to block but -10 to speed when equipped."
        },
        5013: {
            name: "Hardened boots",
            displayInInventory: true,
            category: ["object", "equipment"],
            displayInShop: true,
            addToInventory: true,
            emoji: "👞",
            description: "It's a pair of shoes, but someone slapped advanced carbon fibres on it to make it better. +5 to speed and +2 to block when equipped.",
        },
        5080: {
            name: "Bronze ring",
            displayInInventory: true,
            addToInventory: true,
            category: ["object", "equipment"],
            emoji: "💍",
            cost: 50000,
            description: "Your grandma probably has one of these. +3 to attack and +3 to block."
        },
        5090: {
            name: "Ring of Light",
            displayInInventory: true,
            displayInShop: true,
            addToInventory: true,
            emoji: "💍",
            category: ["object", "equipment"],
            cost: 5000000,
            description: "A ring forged from pure light. +50 to max health, +10 to block, and +5 to speed when equipped."
        },
        5091: {
            name: "Ring of Flame",
            displayInInventory: true,
            displayInShop: true,
            addToInventory: true,
            emoji: "💍",
            category: ["object", "equipment"],
            cost: 7500000,
            description: "A ring forged from the flames of the underworld. +20 to attack, +15 to block, and +10 to speed when equipped."
        },
        5092: {
            name: "Ring of Ice",
            displayInInventory: true,
            displayInShop: true,
            addToInventory: true,
            emoji: "💍",
            category: ["object", "equipment"],
            cost: 7500000,
            description: "A ring forged ice on another world. +35 to block when equipped."
        },
        5093: {
            name: "Ring of Vitality",
            displayInInventory: true,
            displayInShop: true,
            addToInventory: true,
            emoji: "🛟",
            category: ["object", "equipment"],
            cost: 10000000,
            description: "A ring that gives you energy. +200 to max health and +5 to block when equipped."
        },
        5094: {
            name: "Ring of the Blizzard",
            displayInInventory: true,
            displayInShop: true,
            addToInventory: true,
            emoji: "💍",
            category: ["object", "equipment"],
            cost: 10000000,
            description: "Forged at the core of ice storms raging on a distant world, this ring will give you +50 to block when equipped."
        },
        5095: {
            name: "Ring of Rings",
            displayInInventory: true,
            displayInShop: true,
            addToInventory: true,
            emoji: "💍",
            category: ["object", "equipment"],
            cost: 15000000,
            description: "It's a ring made of other rings! +50 to max health, +20 to block, +15 to attack, and +10 to speed when equipped."
        },
        5099: {
            name: "Ring of the void",
            displayInInventory: true,
            displayInShop: true,
            addToInventory: true,
            emoji: "💍",
            category: ["object", "equipment"],
            cost: 98765432100,
            description: "The energy contained in one of these rings can erase all of reality. +500 to max halth, +100 to attack, +75 to block, and +50 to speed."
        },
        6001: {
            name: "Conversion apparatus",
            displayInInventory: true,
            displayInShop: true,
            addToInventory: true,
            oneOff: true,
            emoji: "🥡",
            category: ["object"],
            description: "Convert 1000 health to 1 unwithering flower, or the do the opposite. You can only do this once per day.",
            cost: 50000000,
            scripts: {
                canBuy: function (userInfo) {
                    if (userInfo.level < 30) {
                        return {
                            canBuy: false,
                            messageToUser: "You must be at least level 30 to buy this item."
                        }
                    }
                    return {
                        canBuy: true
                    }
                },
                canUse: function (userInfo, metadata, optionChosen) {
                    let date = scriptingUtils.getCurrentDay();
                    if (userInfo.lastConversionApparatus === date) {
                        return {
                            canUse: false,
                            messageToUser: "You have already used the conversion apparatus today."
                        }
                    } else {
                        if (optionChosen === "health -> flower") {
                            if (userInfo.combat.health <= 1000) {
                                return {
                                    canUse: false,
                                    messageToUser: "You do not have enough health to use the conversion apparatus."
                                }
                            }
                        } else {
                            if (optionChosen === "flower -> health") {
                                if (userInfo.combat.health >= userInfo.maxHealth) {
                                    return {
                                        canUse: false,
                                        messageToUser: "Cannot convert unwithering flowers to health; you are already at max health!"
                                    }
                                }
                                if (userInfo.unwitheringFlowers <= 0) {
                                    return {
                                        canUse: false,
                                        messageToUse: "You don't have any unwithering flowers remaining!"
                                    }
                                }
                            }
                        }
                        return {
                            canUse: true,
                            messageToUser: "You can use this item."
                        }
                    }
                },
                getInteractionOptions: _ => {
                    return {
                        msg: "What would you like to do?",
                        options: ["health -> flower", "flower -> health"],
                    }
                },
                onUse(userInfo, metadata, optionChosen) {
                    if (optionChosen === "health -> flower") {
                        userInfo.combat.health -= 1000;
                        userInfo.unwitheringFlowers++
                    } else {
                        userInfo.unwitheringFlowers--;
                        userInfo.combat.health += 1000;
                    }
                    userInfo.lastConversionApparatus = scriptingUtils.getCurrentDay();
                    return {
                        messageToUser: `You are now on ${userInfo.combat.health} health with ${userInfo.unwitheringFlowers} unwithering flowers.\n`
                    }
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
            onBuy: function (userData) {
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
