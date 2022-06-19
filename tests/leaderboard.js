module.exports = async () => {
    const paintfordiscord = require('../dist/index');

    const img = await paintfordiscord.generateLeaderboard([{
        username: 'test-user',
        score: 100
    }]);

    try {
        await paintfordiscord.generateLeaderboard([{
            username: 'test-user',
            score: 10
        }]);
    } catch(e) {
        console.log(e);
    }

    return img;
}
