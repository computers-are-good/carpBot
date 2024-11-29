module.exports = {
    dungeonText: {
        test: [
            {
                type: "prebattle",
                content: {
                    name: "Rat"
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
                    name: "Rat"
                }
            },
            {
                type: "battle",
                content: {
                    name: "Rat",
                    level: 10,
                    enemyMultipliers: {
                        health: 1.5,
                        block: 0.8
                    }
                }
            },
        ]
    }
    
}
