//@ts-check
const leaderboardTest = require("./leaderboard");
const images = [];
const fs = require("fs");

(async () => {
    images.push(await leaderboardTest());

    images.forEach(async img => {
        fs.writeFileSync("test.png", img, "binary");
    })
})();
