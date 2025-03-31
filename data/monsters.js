module.exports = {
    monsters: {
        Rat: {
            health: 10,
            block: 3,
            attack: 11,
            speed: 30,
            img: "rat.jpg",
        },
        "Large Rat": {
            health: 50,
            block: 3,
            attack: 21,
            speed: 25,
            img: "rat.jpg",
        },
        "Squirrel": {
            health: 25,
            block: 5,
            attack: 15,
            speed: 15
        },
        "Bat": {
            health: 10,
            block: 5,
            attack: 8,
            speed: 100
        },
        "Mosquito": {
            health: 1,
            block: 1,
            attack: 1,
            speed: 999
        },
        "Goblin": {
            health: 15,
            block: 7,
            attack: 15,
            speed: 50
        },
        "Snake": {
            health: 20,
            block: 10,
            attack: 10,
            speed: 75
        },
        "Monella, Ultimate Master": {
            health: 500000,
            block: 40,
            speed: 130,
            attack: 100,
            probabilities: {
                "doublestrike": 0.3
            }
        },
        "Sytlar, Demon of the Underworld": {
            health: 7500000,
            block: 10,
            attack: 130,
            speed: 50
        },
        "Tratlus, Master of Blocking": {
            health: 500000,
            block: 40,
            speed: 60,
            attack: 120,
            probabilities: {
                "totalblock": 0.5
            }
        },
        "Goldiar, Dragon Hoarder": {
            health: 1000,
            block: 40,
            speed: 60,
            attack: 15000,
            probabilities: {
                "doublestrike": 0.5
            }
        },
    },
    raidBossLoot: { //Damage required to obtain that piece of loot: shop ID number
        "Monella, Ultimate Master": {
            2012: 400,
            2010: 750,
            2013: 450,
            3001: 2000,
        },
        "Sytlar, Demon of the Underworld": {
            2005: 300,
            2012: 400,
            2013: 450,
            3003: 2000
        },
        "Tratlus, Master of Blocking": {
            3002: 2500,
            2012: 500,
            2013: 450,
            2009: 250,
        },
        "Goldiar, Dragon Hoarder": {
            3004: 50,
            2012: 500,
            2013: 450,
            2009: 250,
        }
    }
}