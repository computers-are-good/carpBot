module.exports = {
    learnList: [
        //Generally, the EXP gained should be around half of (cost / 100)
        {
            name: "Calculus",
            description: "Hard maths. Increase your work money multiplier.",
            cost: 1500000,
            exp: 6000,
            onLearn: function (userInfo) {
                userInfo.permanentWorkMultiplier += 0.2;
            }
        },
        {
            name: "Calculus II",
            description: "Even harder maths. Increase your work money multiplier.",
            cost: 3000000,
            exp: 12000,
            onLearn: function (userInfo) {
                userInfo.permanentWorkMultiplier += 0.4;
            }
        },
        {
            name: "Calculus III",
            description: "Harder than even harder maths. Increase your work money multiplier.",
            cost: 6000000,
            exp: 24000,
            onLearn: function (userInfo) {
                userInfo.permanentWorkMultiplier += 0.6;
            }
        },
        {
            name: "Statistics",
            description: "Hard maths but easy. Increase your work money multiplier.",
            cost: 220000,
            exp: 1500,
            onLearn: function (userInfo) {
                userInfo.permanentWorkMultiplier += 0.2;
            }
        },
        {
            name: "Statistics II",
            description: "Harder maths but easy. Increase your work money multiplier.",
            cost: 440000,
            exp: 3000,
            onLearn: function (userInfo) {
                userInfo.permanentWorkMultiplier += 0.4;
            }
        },
        {
            name: "Statistics III",
            description: "Harder maths than hard maths but easy. Increase your work money multiplier.",
            cost: 880000,
            exp: 6000,
            onLearn: function (userInfo) {
                userInfo.permanentWorkMultiplier += 0.6;
            }
        },
        {
            name: "Cooking",
            cost: 59900,
            exp: 512,
            description: "Learning to cook allows you to use /cook to make an item. What you make will be based on your level." //TO IMPLEMENT
        },
        {
            name: "Flying",
            cost: 60000000,
            exp: 250000,
            description: "Learning to fly decreases the chance you will be caught when you try to rob another player" //TO IMPLEMENT
        },
        {
            name: "Swimming",
            cost: 22000,
            exp: 150,
            description: "After you learn this skill, your maximum health will increase by 20",
            onLearn: function (userInfo) {
                userInfo.combat.maxHealth += 20;
            }
        },
        {
            name: "Yelling and screaming",
            cost: 1,
            exp: 1,
            description: "Return to baby."
        },
        {
            name: "Drama",
            cost: 9900000,
            exp: 30000,
            description: "Learning drama increases the money you get from working.",
            onLearn: function (userInfo) {
                userInfo.permanentWorkMultiplier += 0.5;
            }
        },

        {
            name: "Violin",
            cost: 99999999,
            exp: 567765,
            description: "Learning violin makes you look and sound really cool. Your stats wil double for the first battle of each day as you play a rallying song." //TO IMPLEMENT
        },
        {
            name: "Unreality",
            cost: 999999999,
            exp: 4999999,
            description: "After learning unreality, each time you increase your stats via /train, your stats will be increased again for free." //TO IMPLEMENT
        },
        {
            name: "Chemiscry",
            cost: 10,
            exp: 50,
            descrption: "Chemistry is hard, so we've changed the name to chemiscry."
        },
        {
            name: "Shapeshifting",
            cost: 5555555500,
            exp: 22222222,
            description: "After you learn shapeshifting, you have a 10% chance to take no damage from the enemy in combat." //TO IMPLEMENT
        },
        {
            name: "Haggling",
            cost: 1240300,
            exp: 6000,
            description: "After you learn haggling, prices in the shop will decrease by 5%." //TO IMPLEMENT
        }
    ]
}