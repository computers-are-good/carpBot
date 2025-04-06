module.exports = {
    defaultUserData: {
        level: 1,
        username: "",
        expRequired: 10,
        unwitheringFlowers: 0,
        inventory: [],
        moneyOnHand: 0,
        permanentWorkMultiplier: 1,
        sellMultiplier: 1,
        lastDaily: "",
        healingInterval: 60000,
        combat: {
            health: 100,
            block: 10,
            maxHealth: 100,
            attack: 10,
            speed: 50,
            probabilities: {}
        },
        abilitiesImproved: {
            maxHealth: 0,
            block: 0,
            attack: 0,
            speed: 0,
            healingInterval: 0
        },
        equipment: {
            sword: 0,
            armor: 0,
            boots: 0,
            ring: 0,
        },
        lastHealthRestoration: 0,
        pets:[],
        moneyBankAccount: 0,
        megaGem: 0,
        passiveMode: false,
        lastGotRobbed: 0,
        lastTogglePassiveMode: 0,
        lastRobbedSomeone: 0,
        effects: [],
        friends: [],
        dungeonsCompleted: [],
        learned: [],
        lifetimeMoneyFromWorking: 0,
        notifications: [],
        lastConversionApparatus: ""
    }
}