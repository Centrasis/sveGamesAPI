"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVEGameServer = void 0;
var svebaselib_1 = require("svebaselib");
var SVEGameServer = /** @class */ (function () {
    function SVEGameServer() {
    }
    SVEGameServer.listGames = function (requester) {
        return new Promise(function (resolve, reject) {
            fetch(svebaselib_1.SVESystemInfo.getGameRoot() + "/list?sessionID=" + encodeURI(requester.getInitializer().sessionID), {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                if (res.status < 400) {
                    res.json().then(function (j) {
                        resolve(j);
                    }, function (err) { return reject(err); });
                }
                else {
                    reject();
                }
            }, function (err) { return reject(err); });
        });
    };
    SVEGameServer.listGameTypes = function (requester) {
        return new Promise(function (resolve, reject) {
            fetch(svebaselib_1.SVESystemInfo.getGameRoot() + "/list/types?sessionID=" + encodeURI(requester.getInitializer().sessionID), {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                if (res.status < 400) {
                    res.json().then(function (j) {
                        resolve(j);
                    }, function (err) { return reject(err); });
                }
                else {
                    reject();
                }
            }, function (err) { return reject(err); });
        });
    };
    SVEGameServer.listPlayers = function (requester, gameName) {
        return new Promise(function (resolve, reject) {
            fetch(svebaselib_1.SVESystemInfo.getGameRoot() + "/players/" + gameName + "?sessionID=" + encodeURI(requester.getInitializer().sessionID), {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                if (res.status < 400) {
                    res.json().then(function (j) {
                        resolve(j);
                    }, function (err) { return reject(err); });
                }
                else {
                    reject();
                }
            }, function (err) { return reject(err); });
        });
    };
    SVEGameServer.hostGame = function (gi) {
        return new Promise(function (resolve, reject) {
            fetch(svebaselib_1.SVESystemInfo.getGameRoot() + "/new?sessionID=" + encodeURI(gi.host.getInitializer().sessionID), {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: {
                    name: gi.name,
                    id: gi.id,
                    type: gi.type,
                    host: (typeof gi.host !== "string") ? gi.host.getName() : gi.host,
                    maxPlayers: gi.maxPlayers,
                    minPlayers: gi.minPlayers,
                    playersCount: gi.playersCount,
                    state: gi.state
                }
            }).then(function (res) {
                if (res.status < 400) {
                    resolve(gi);
                }
                else {
                    reject();
                }
            }, function (err) { return reject(err); });
        });
    };
    SVEGameServer.updateGame = function (gi, player) {
        return new Promise(function (resolve, reject) {
            fetch(svebaselib_1.SVESystemInfo.getGameRoot() + "/update/" + encodeURI(gi.name) + "?sessionID=" + encodeURI(player.getInitializer().sessionID), {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: {
                    name: gi.name,
                    id: gi.id,
                    type: gi.type,
                    host: (typeof gi.host !== "string") ? gi.host.getName() : gi.host,
                    maxPlayers: gi.maxPlayers,
                    minPlayers: gi.minPlayers,
                    playersCount: gi.playersCount,
                    state: gi.state
                }
            }).then(function (res) {
                if (res.status < 400) {
                    resolve(gi);
                }
                else {
                    reject();
                }
            }, function (err) { return reject(err); });
        });
    };
    return SVEGameServer;
}());
exports.SVEGameServer = SVEGameServer;
