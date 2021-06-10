const fs = require('fs');
const gameScraper = require('./gamePlatformScraper');

const rawData = fs.readFileSync('game-data/game.json');
const parsedData = JSON.parse(rawData);
const appIds = parsedData.gamesList?.games.game.map(c => c.appID);

// spits out an array of game names, and platforms 
gameScraper.getGamePlatforms(appIds, true).then((gamesPlatforms) => {
    if (gamesPlatforms.length > 0) {
        // output that to console
        console.log("Total games: ", gamesPlatforms.length);
        console.log("Windows games: ", gamesPlatforms.filter(c => c.windows).length, gamesPlatforms.filter(c => c.windows).map(c => c.name)
            .sort((c1,c2) => textSorter(c1.name, c2.name)));
        console.log("Mac games: ", gamesPlatforms.filter(c => c.mac).length, gamesPlatforms.filter(c => c.mac).map(c => c.name)
            .sort((c1,c2) => textSorter(c1.name, c2.name)));
        console.log("Linux games: ", gamesPlatforms.filter(c => c.linux).length, gamesPlatforms.filter(c => c.linux).map(c => c.name)
            .sort((c1,c2) => textSorter(c1.name, c2.name)));
    } else {
        console.log("Found no games from scrape");
    }
}).catch((err) => {
    console.error("Sad mario noises");
});

function textSorter(c1, c2) {
    if (c1 < c2) {
        return -1;
    }
    if (c1 > c2) {
        return 1;
    }
    return 0;
}
