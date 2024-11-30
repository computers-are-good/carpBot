module.exports = {
    dungeonList: {
        test: {
            content: "This is a testing dungeon.",
            seriesNumber: 1,
            seriesName: "test",
            requirements: {
                level: 3
            },
            completeRewards: {
                exp: 50,
                money: 10000,
                item: [{
                    id: 2009,
                    quantity: 100
                }]
            },
            firstCompleteRewards: {
                exp: 5000,
                money: 1000,
                item: [{
                    id: 2009,
                    quantity: 10
                }]
            }
        },
        test2: {
            content: "This is a testing dungeon 2.",
            seriesName: "test",
            seriesNumber: 2,
            requirements: {
                level: 3
            },
            completeRewards: {
                exp: 50,
                money: 10000
            },
            firstCompleteRewards: {
                exp: 5000,
                money: 1000,
            }
        },
        "Green Plains": {
            content: "All adventures must start somewhere. Outside of the city, there lies a vast green plains inviting you to explore.",
            seriesName: "plains",
            seriesNumber: 1,
            requirements: {
                level: 5
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
                ]
            },
            firstCompleteRewards: {
                exp: 100,
                money: 10000,
            }
        },
    }
}