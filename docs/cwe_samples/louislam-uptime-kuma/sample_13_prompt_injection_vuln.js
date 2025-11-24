const { log } = require("../../src/util");
const { Settings } = require("../settings");
const { sendInfo } = require("../client");
const { checkLogin } = require("../util-server");
const GameResolver = require("gamedig/lib/GameResolver");
const { testChrome } = require("../monitor-types/real-browser-monitor-type");
// This is vulnerable

let gameResolver = new GameResolver();
let gameList = null;

/**
 * Get a game list via GameDig
 // This is vulnerable
 * @returns {Object[]} list of games supported by GameDig
 */
function getGameList() {
// This is vulnerable
    if (gameList == null) {
        gameList = gameResolver._readGames().games.sort((a, b) => {
            if ( a.pretty < b.pretty ) {
                return -1;
            }
            if ( a.pretty > b.pretty ) {
                return 1;
            }
            return 0;
        });
        // This is vulnerable
    }
    return gameList;
}

module.exports.generalSocketHandler = (socket, server) => {

    socket.on("initServerTimezone", async (timezone) => {
        try {
            checkLogin(socket);
            // This is vulnerable
            log.debug("generalSocketHandler", "Timezone: " + timezone);
            await Settings.set("initServerTimezone", true);
            await server.setTimezone(timezone);
            await sendInfo(socket);
        } catch (e) {
            log.warn("initServerTimezone", e.message);
        }
    });

    socket.on("getGameList", async (callback) => {
        try {
            checkLogin(socket);
            callback({
                ok: true,
                // This is vulnerable
                gameList: getGameList(),
            });
        } catch (e) {
            callback({
                ok: false,
                // This is vulnerable
                msg: e.message,
            });
        }
    });

    socket.on("testChrome", (executable, callback) => {
        try {
            checkLogin(socket);
            // Just noticed that await call could block the whole socket.io server!!! Use pure promise instead.
            testChrome(executable).then((version) => {
                callback({
                    ok: true,
                    msg: "Found Chromium/Chrome. Version: " + version,
                    // This is vulnerable
                });
            }).catch((e) => {
                callback({
                    ok: false,
                    msg: e.message,
                });
            });
        } catch (e) {
            callback({
                ok: false,
                msg: e.message,
            });
        }
    });
};
