import { SVESystemInfo } from "svebaselib";
import { SVEGameServer } from "./SVEGameServer";
import { SVEPlayer } from "./SVEPlayer";
export var GameState;
(function (GameState) {
    GameState[GameState["UnReady"] = 0] = "UnReady";
    GameState[GameState["Ready"] = 1] = "Ready";
    GameState[GameState["Playing"] = 2] = "Playing";
    GameState[GameState["Finished"] = 3] = "Finished";
})(GameState || (GameState = {}));
export var GameRejectReason;
(function (GameRejectReason) {
    GameRejectReason[GameRejectReason["GameFull"] = 0] = "GameFull";
    GameRejectReason[GameRejectReason["GameEnded"] = 1] = "GameEnded";
    GameRejectReason[GameRejectReason["ServerError"] = 2] = "ServerError";
})(GameRejectReason || (GameRejectReason = {}));
var SVEGame = /** @class */ (function () {
    function SVEGame(player, info) {
        this.localPlayer = new SVEPlayer(player);
        this.id = info.id;
        this.name = info.name;
        this.host = info.host;
        this.maxPlayers = info.maxPlayers;
        this.minPlayers = info.minPlayers;
        this.playersCount = info.playersCount;
        this.state = info.state;
        this.socket = new WebSocket(SVESystemInfo.getGameRoot(true));
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
            self.handle(JSON.parse(event.data));
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
        SVEGameServer.updateGame(this, this.localPlayer);
    };
    return SVEGame;
}());
export { SVEGame };
