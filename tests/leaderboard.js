module.exports = async () => {
    const paintfordiscord = require('../dist/index');

    const img = await paintfordiscord.generateLeaderboard([{
        username: 'test-user',
        score: 100
    }]);

    return img;
}
