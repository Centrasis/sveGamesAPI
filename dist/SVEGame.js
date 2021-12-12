"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVEGame = exports.GameRejectReason = exports.GameState = void 0;
var svebaselib_1 = require("svebaselib");
var SVEGameServer_1 = require("./SVEGameServer");
var SVEPlayer_1 = require("./SVEPlayer");
var socket_io_client_1 = __importDefault(require("socket.io-client"));
var GameState;
(function (GameState) {
    GameState[GameState["UnReady"] = 0] = "UnReady";
    GameState[GameState["Ready"] = 1] = "Ready";
    GameState[GameState["Playing"] = 2] = "Playing";
    GameState[GameState["Finished"] = 3] = "Finished";
})(GameState = exports.GameState || (exports.GameState = {}));
var GameRejectReason;
(function (GameRejectReason) {
    GameRejectReason[GameRejectReason["GameFull"] = 0] = "GameFull";
    GameRejectReason[GameRejectReason["GameEnded"] = 1] = "GameEnded";
    GameRejectReason[GameRejectReason["ServerError"] = 2] = "ServerError";
})(GameRejectReason = exports.GameRejectReason || (exports.GameRejectReason = {}));
var SVEGame = /** @class */ (function () {
    function SVEGame(player, info) {
        this.localPlayer = new SVEPlayer_1.SVEPlayer(player);
        this.id = info.id;
        this.name = info.name;
        this.host = info.host;
        this.maxPlayers = info.maxPlayers;
        this.minPlayers = info.minPlayers;
        this.playersCount = info.playersCount;
        this.state = info.state;
        this.type = info.type;
        this.assetPath = info.assetPath;
        var target = svebaselib_1.SVESystemInfo.getGameRoot(true);
        console.log("Attempting to connect with game at:", target);
        this.socket = socket_io_client_1.default(target, {
            extraHeaders: {
                sessionID: player.getSessionID(),
                gid: this.name
            }
        });
        var self = this;
        this.socket.on("connect", function () {
            self.onJoin();
        });
        this.socket.on("error", function (event) {
            console.log("Socket error: ", event);
            self.onAbort(GameRejectReason.ServerError);
        });
        this.socket.on("disconnect", function (event) {
            self.onAbort(SVEGame.str2GameRejectReason(event));
        });
        this.socket.on("message", function (event) {
            self.handleIncoming(JSON.parse(event));
        });
        this.socket.connect();
    }
    SVEGame.str2GameRejectReason = function (str) {
        switch (str) {
            case "GameEnded":
                return GameRejectReason.GameEnded;
                break;
            case "ServerError":
                return GameRejectReason.ServerError;
                break;
            case "GameFull":
                return GameRejectReason.GameFull;
                break;
            default:
                return GameRejectReason.ServerError;
                break;
        }
    };
    SVEGame.prototype.handle = function (action) {
        this.socket.send(JSON.stringify(action));
    };
    SVEGame.prototype.getLocalPlayerName = function () {
        return this.localPlayer.getName();
    };
    SVEGame.prototype.getLocalPlayer = function () {
        return this.localPlayer;
    };
    SVEGame.prototype.endGame = function () {
        this.state = GameState.Finished;
        SVEGameServer_1.SVEGameServer.updateGame(this, this.localPlayer);
    };
    SVEGame.prototype.startGame = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.state = GameState.Playing;
            SVEGameServer_1.SVEGameServer.updateGame(_this, _this.localPlayer).then(function () {
                resolve();
            }, function (err) { return reject(err); });
        });
    };
    SVEGame.prototype.getMetaInfos = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fetch(svebaselib_1.SVESystemInfo.getGameRoot() + "/meta/" + _this.name + "?sessionID=" + encodeURI(_this.localPlayer.getSessionID()), {
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
    SVEGame.prototype.setMetaInfos = function (meta) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fetch(svebaselib_1.SVESystemInfo.getGameRoot() + "/meta/" + _this.name + "?sessionID=" + encodeURI(_this.localPlayer.getSessionID()), {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(meta)
            }).then(function (res) {
                if (res.status < 300) {
                    resolve();
                }
                else {
                    reject();
                }
            }, function (err) { return reject(err); });
        });
    };
    SVEGame.prototype.setReady = function () {
        this.state = GameState.Ready;
        SVEGameServer_1.SVEGameServer.updateGame(this, this.localPlayer);
    };
    return SVEGame;
}());
exports.SVEGame = SVEGame;
