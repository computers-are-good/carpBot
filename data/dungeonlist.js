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
    }
}