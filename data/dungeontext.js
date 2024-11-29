module.exports = {
    dungeonText: {
        test: [
            {
                type: "prebattle",
                content: {
                    name: "Rat",
                    enemyMultipliers: {
                        health: 1.5,
                        block: 0.8
                    }
                }
            },
            {
                type: "battle",
                content: {
                    name: "Rat",
                    level: 5,
                    enemyMultipliers: {
                        health: 1.5,
                        block: 0.8
                    }
                }
            },
        ],
        test2: [
            {
                type: "prebattle",
                content: {
                    name: "Rat",
                    level: 1000,
                    enemyMultipliers: {
                        health: 1.5,
                        block: 0.8
                    }
                }
            },
            {
                type: "battle",
                content: {
                    name: "Rat",
                    level: 1000,
                    enemyMultipliers: {
                        health: 1.5,
                        block: 0.8
                    }
                }
            },
        ]
    }
    
}
