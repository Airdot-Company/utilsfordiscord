//@ts-check
const leaderboardTest = require("./leaderboard");
const images = [];
const fs = require("fs");

(async () => {
    images.push({
        buffer: await leaderboardTest(),
        name: "leaderboard_test"
    });

    images.forEach(async img => {
        fs.writeFileSync(`./tests/images/${img.name}.png`, img.buffer, "binary");
    })
})();
