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
    }
}