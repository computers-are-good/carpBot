module.exports = {
    helpText: {
        apple: [
            "Usage: `/apple`. 🍎 Plays bad apple."
        ],
        basicHelp: [
            "Welcome to crapbot!",
            "Earn money, role play, enter dungeons, and more!",
            "To start, `/work` to earn some money. Use `/shop` to see which items are for sale and `/buy` to purchase them. Use `/balance` to check your account balance.",
            "As you work, you will earn experience and level up. This will increase your stats in combat, as and increase the amount of money you get from working.",
            "Want to level up fast? Buy EXP potions from the shop, or use `/learn`.",
            "Beware! Other players can steal your money with `/steal`. You can buy various items to defend yourself, or turn on passive mode with `/passivemode`.",
            "Want to fight monsters? Level up, then go and enter a dungeon with `/dungeon`! Use `/dungeonlist` to see which dungeons are available.",
            "Some commands like `/rob` and `/dungeon` will lock you in. CrapBot will not respond to other commands until you finish what you're doing.",
            "That's all for now! We hope you have fun with CrapBot.",
        ],
        balance: [
            "Usage: `/balance`. Checks your level, and much money you have in your wallet and bank account."
        ],
        ban: [
            "Usage: `/ban [user]`. Admin only. Once a user is banned CrapBot will not respond to them, not even with a \"You are banned\" message.",
            "**Be careful! You can ban yourself!**"
        ],
        bankrob: [
            "Usage: `/bankrob`. Go and rob a bank! In order to be successful, you must answer 5 true or false questions correctly.",
            "If you are successful, you will get a large amount of money!",
            "If you fail, either by answering incorrectly or by timing out, you will become a criminal and must lie low for 4 hours.",
            "This means you cannot work or rob another bank until the effect expires."
        ],
        buy: [
            "Usage: `/buy [item] [quantity]`. Buys items from the shop. Use `/shop` to see which items are for sale. If not specified, quantity will default to 1."
        ],
        collectrent: [
            "Usage: `/collectrent`. Collects rent from your houses. The higher level the house, the more rent you will be able to collect from it. You must have at least 1 house to be able to collect rent.",
            "You get around $15,000 per day from each house."
        ],
        cook: [
            "Usage: `/cook`. Cooks food in your kitchen. What you make is dependent on your level. Reaching level 10 gives you a roughly 50% chance to make coffee.",
            "As you level up, you will be able to make more complex items with more powerful effects, but there's always a chance you'll blow up the kitchen...",
            "To unlock this command, you must learn the cooking skill first with `/learn cooking`"
        ],
        daily: [
            "Usage: `/daily`. Claim a daily reward bonus. This will give you some money in accordance with your level."
        ],
        deposit: [
            "Usage: `/deposit`. Deposites money into your bank account. Money in your bank account cannot be stolen by other players."
        ],
        dungeon: [
            "usage: `/dungeon [dungeon to enter]`. Enters a dungeon!",
            "You will be able to fight monsters in the dungeon. Fights are done automatically for you, and the outcome is based on your and the enemy's stats",
            "Health determines how much damage you can take. Attack is how much damage you deal. Each turn, you and your enemy will gain a shield equal to their block. The shield is emptied first before health",
            "Defeat all the enemies in a dungeon to clear it and earn some rewards. If you are defeated by an enemy or you choose to stop, the dungeon will be failed.",
            "Some dungeons require additional requirements like level before you can challenge it. You must finish the previous dungeon in a series before challenging the next one."
        ],
        dungeonlist: [
            "Usage: `/dungeonlist [incomplete]`, where completed is true or false. If incomplete is true, then only the dungeons you haven't done will be shown.",
            "This command lists all the dungeons you can do and filters out the ones you can't. If a dungeon is not shown to you, try levelling up."
        ],
        equip: [
            "Usage: `/equip [item]`. Equip an item from your inventory to improve your stats.",
            "If the item is already equipped, it will be unequipped."
        ],
        inventory: [
            "Usage: `/inventory`. Displays what's in your inventory."
        ],
        leaderboard: [
            "Usage: `/leaderboard`. Displays the top 5 users with the most money. This is updated periodically."
        ],
        learn: [
            "Usage: `/learn [skill]`. Spend money to learn a skill and gain a large amount of experience."
        ],
        notify: [
            "Usage: `/notify [@player] [message]`. The next time that player performs an action in CrapBot, they will see your notification."
        ],
        passivemode: [
            "Usage: `/passivemode`. Toggles passive mode on or off. While you are in passive mode, you cannot be grieved by commands like `/rob`, but you also can't grieve other players",
            "After toggling passive mode on or off, you must wait for at least 24 hours before turning it on or off again."
        ],
        pay: [
            "Usage: `/pay [player] [amount]`. Pays another player with the specified amount of money."
        ],
        pet: [
            "Usage: `/pet [pet]`. Do something together with your pet to raise your bond level with them."
        ],
        petbuy: [
            "Usage: `/petbuy [type]`. Buys a pet (e.g. dog or cat). If type is not specified, then CrapBot will list all types of pet available."
        ],
        petlist: [
            "Usage: `/petlist`. Lists the pets you have"
        ],
        petrename: [
            "Usage: `/petrename [oldname] [newname]`. Renames a pet. For oldname, you can either put the type of pet (e.g. dog) or the name of your pet.",
            "Please note that a profanity filter is in use."
        ],
        ping: [
            "Usage: `/ping`. CrapBot will reply with \"Pong!\""
        ],
        pvp: [
            "Usage: `/pvp [@player]`. Engage in a PvP battle with another player! Cannot be used if the target player has passive mode enabled.",
            "If you win, you will win some money, but the opposing player will not lose money."
        ],
        raid: [
            "Usage: `/raid`. Raid a boss! Everyone playing CrapBot has the same boss to attack.",
            "You will only do a small amount of damage to the boss, but don't worry! The boss is difficult for everyone involved.",
            "The more damage you deal to the raid boss, the more rewards you will get from it, including boss-exclusive loot.",
            "Each time you attack the boss, you have a 20% chance of obtaining an unwithering flower, which can be used to purchase items in the shop.",
            "You can attack a boss a maximum of five times in a day. If you want to attack the boss more, you need to use unwithering flowers."
        ],
        rob: [
            "Usage: `/rob [player]`. This will rob some money from another player. You can only rob the money in their wallet, not their bank account.",
            "If successful, you will gain 10% of the target's money. If unsuccessful, the target will get 2% of yours.",
            "Robberies against players recently robbed are less likely to be successful."
        ],
        sell: [
            "Usage: `/sell [item]`. Sells something to the shop.",
            "You will sell items for 50% of their cost. This can be improved to a maximum of 95%."
        ],
        shop: [
            "Usage: `/shop [category]`. Browses the shop. You can optionally enter a category and only items in that category will be shown to you."
        ],
        stats: [
            "Usage: `/stats`. Displays your combat stats."
        ],
        train: [
            "Usage: `/train [\"Health\"|\"Attack\"|\"Block\"|\"Speed\"|\"Healing Interval\"]`. Spend some money to improve your stats.",
            "The more times you improve a stat, the more money you need to upgrade it."
        ],
        unban: [
            "Usage: `/unban [user]`. Unbans a user."
        ],
        upgradehouse: [
            "Usage: `/upgradehouse [address|\"list\"]`. Spend money to upgrade a house. Upgraded houses generate more rent.",
            "You can use `/upgradehouse list` to see a list of your houses."
        ],
        use: [
            "Usage: `/use [item] [quantity]`. Uses an item from your inventory"
        ],
        withdraw: [
            "Usage: `/withdraw [amount]`. Withdraws money from your bank account so you can spend it. Beware that withdrawn money can be robbed!"
        ],
        work: [
            "Usage: `/work`. Work to earn some money and experience. The amount earned is based on your level.",
            "Various items like Green Tea and Coffee can increase the amount of experience or money you earn."
        ]
    }
}