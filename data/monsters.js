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
            3011: 2000
        },
        "Tratlus, Master of Blocking": {
            3002: 2500,
            2012: 500,
            2013: 450,
            2009: 250,
        }
    }
}