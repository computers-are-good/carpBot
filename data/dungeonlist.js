module.exports = {
    dungeonList: {
        "Green Plains": {
            content: "All adventures must start somewhere. Outside of the city, there lies a vast green plains inviting you to explore.",
            seriesName: "plains",
            seriesNumber: 1,
            requirements: {
                level: 3
            },
            completeRewards: {
                exp: 50,
                money: 1000,
                item: [{
                    id: 2010,
                    quantity: [1, 3],
                    probability: 0.5
                },
                {
                    id: 2009,
                    quantity: [1, 3],
                    probability: 0.3
                },
                {
                    id: 2002,
                    quantity: 1,
                    probability: 0.8
                },
                {
                    id: 2014,
                    quantity: 1,
                    probability: 0.5
                }
                ]
            },
            firstCompleteRewards: {
                exp: 100,
                money: 10000,
            }
        },
        "Green Plains 2": {
            content: "Where does the stream lead? It's a question you find yourself asking.",
            seriesName: "plains",
            seriesNumber: 2,
            requirements: {
                level: 3
            },
            completeRewards: {
                exp: 150,
                money: 5000,
                item: [{
                    id: 2010,
                    quantity: [1, 5],
                    probability: 0.5
                },
                {
                    id: 2009,
                    quantity: [1, 5],
                    probability: 0.3
                },
                {
                    id: 2002,
                    quantity: 1,
                    probability: 0.8
                },
                {
                    id: 2015,
                    quantity: 1,
                    probability: 0.02
                }
                ]
            },
            firstCompleteRewards: {
                exp: 100,
                money: 10000,
                item: [
                    {
                        id: 4001,
                        quantity: 1,
                    },
                    {
                        id: 2014,
                        quantity: 5
                    }
                ]
            }
        },
        "Green Plains 3": {
            content: "It's a pretty peaceful evening by the hut.",
            seriesName: "plains",
            seriesNumber: 2,
            requirements: {
                level: 5
            },
            completeRewards: {
                exp: 200,
                money: 5000,
                item: [{
                    id: 2010,
                    quantity: [2, 5],
                    probability: 0.5
                },
                {
                    id: 2009,
                    quantity: [2, 5],
                    probability: 0.3
                },
                {
                    id: 2012,
                    quantity: 1,
                    probability: 0.05
                },
                {
                    id: 2002,
                    quantity: 1,
                    probability: 0.8
                },
                {
                    id: 2015,
                    quantity: 1,
                    probability: 0.05
                }]
            }
        },
        "Path of Jade": {
            content: "You heard rumours about a monster-infested trail which promises to reward those who attempt it with fortunes.",
            seriesName: "path",
            seriesNumber: 1,
            requirements: {
                level: 5
            },
            completeRewards: {
                exp: 50,
                item: [
                    {
                        id: 4002,
                        quantity: [3,6],
                        probability: 1
                    }
                ]
            }
        },
        "Path of Diamonds": {
            content: "At the end of the Path of Jade, there appears to be another trail leading you on. **You need 1x Jade for this dungeon**",
            seriesName: "path",
            seriesNumber: 2,
            requirements: {
                level: 10
            },
            completeRewards: {
                exp: 100,
                item: [
                    {
                        id: 4001,
                        quantity: [4,7],
                        probability: 1
                    }
                ]
            }
        }
    }
}