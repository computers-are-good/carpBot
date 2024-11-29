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
        ],
        "Green Plains": [
            {
                type: "text",
                content: "The sun shines down radiantly on your skin as you enter the plains. It is a beautiful, cloudy day, perfect for a beginner's adventure. You continue walking forward."
            },
            {
                type: "text",
                content: "You come across a tree standing solitarily on the horizon. You approach it, and see a small rat under the tree."
            },
            {
                type: "prebattle",
                content: {
                    name: "Rat",
                    level: 1,
                }
            },
            {
                type: "battle",
                content: {
                    name: "Rat",
                    level: 1,
                }
            },
            {
                type: "text",
                content: "After you defeat the rat, you wander on further into the plains. The scenery changed colour. The vast green grass become yellowed. In the distance, you see two more rats."
            },
            {
                type: "prebattle",
                content: {
                    name: "Rat",
                    level: 1,
                }
            },
            {
                type: "battle",
                content: {
                    name: "Rat",
                    level: 1,
                }
            },
            {
                type: "prebattle",
                content: {
                    name: "Rat",
                    level: 1,
                }
            },
            {
                type: "battle",
                content: {
                    name: "Rat",
                    level: 1,
                }
            },
            {
                type: "text",
                content: "You defeat the two rats. All adventures must start somewhere and sometime, and for you, that somewhere is the plains, and the sometime is today."
            },
        ]
    }
    
}
