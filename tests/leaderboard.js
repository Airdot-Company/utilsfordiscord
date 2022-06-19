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
            },
            {
                username: 'user name',
                score: 15
            },
            {
                username: 'loooooooooooooooooooooooooooooooooooooooooooooooooooong username',
                score: 1
            },
            {
                username: "test-user",
                score: 2
            },
            {
                username: "test-user",
                score: 3
            }
        ]);
    } catch(e) {
        console.log(e);
    }

    return img;
}
