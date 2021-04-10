"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVEGame = exports.GameRejectReason = exports.GameState = void 0;
var svebaselib_1 = require("svebaselib");
var SVEGameServer_1 = require("./SVEGameServer");
var SVEPlayer_1 = require("./SVEPlayer");
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
        this.socket = new WebSocket(svebaselib_1.SVESystemInfo.getGameRoot(true));
        var self = this;
        this.socket.onopen = function (event) {
            self.onJoin();
        };
        this.socket.onerror = function (event) {
            self.onAbort(GameRejectReason.ServerError);
        };
        this.socket.onclose = function (event) {
            self.onAbort(event.code);
        };
        this.socket.onmessage = function (event) {
            self.handleIncoming(JSON.parse(event.data));
        };
    }
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
    SVEGame.prototype.setReady = function () {
        this.state = GameState.Ready;
        SVEGameServer_1.SVEGameServer.updateGame(this, this.localPlayer);
    };
    return SVEGame;
}());
exports.SVEGame = SVEGame;
