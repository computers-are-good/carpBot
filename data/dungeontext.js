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
                content: "The sun shines down as you enter the plains. It is a beautiful, clear day, perfect for a first adventure. You continue walking forward.",
                img: "stream.jpg"
            },
            {
                type: "text",
                content: "You come across a tree on the horizon. You approach it, and see a small rat under the tree.",
                img: "plains.jpg"
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
                content: "After you defeat the rat, you wander on further into the plains. The scenery changed colour. The vast green grass become yellowed. In the distance, you see two more rats.",
                img: "plainsyellowgrass.jpg"
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
                content: "As you defeat the rats, you see a small stream flowing from under the tree. Perhaps following it would lead to more adventure?"
            },
            {
                type: "text",
                content: "You defeat the two rats. All adventures must start somewhere and sometime, and for you. It seems simple, but you are now in the adventuring life."
            },
        ],

        "Green Plains 2": [
            {
                type: "text",
                content: "The stream winds down the yellowed plains. You manage to catch a glimpse of the wavy sun reflected in the water."
            },
            {
                type: "text",
                content: "You wonder where the stream leads, and decide to keep following it."
            },
            {
                type: "text",
                content: "But before you do that, there's some rats to take care of",
            },
            {
                type: "prebattle",
                content: {
                    name: "Rat",
                    level: 2,
                }
            },
            {
                type: "battle",
                content: {
                    name: "Rat",
                    level: 2,
                }
            },
            {
                type: "prebattle",
                content: {
                    name: "Rat",
                    level: 2,
                }
            },
            {
                type: "battle",
                content: {
                    name: "Rat",
                    level: 2,
                }
            },
            {
                type: "text",
                content: "Now that you've defeated the rats, you keep following the stream. You did not realised it, but the stream became wider"
            },
            {
                type: "text",
                content: "However, you do see a ravenous squirrel eating a tree in the distance. You should take care of it before it eats the city."
            },
            {
                type: "prebattle",
                content: {
                    name: "Squirrel",
                    level: 2,
                }
            },
            {
                type: "battle",
                content: {
                    name: "Squirrel",
                    level: 2,
                }
            },
            {
                type: "text",
                content: "It happened slowly, like the sun setting; ever changing but forever out of notice, but what was now a stream was a river."
            },
            {
                type: "text",
                content: "The river leads to a little cottage on the edge of a towering waterfall. Mists of water droplets fly up into the air, glowing in a soft, gentle hue of the sun."
            },
            {
                type: "text",
                content: "The cottage is small but cozy, with a window overlooking the territory below. You decide to stop here for the night."
            }
        ]
    }

}
