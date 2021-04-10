import { SVEAccount, SVESystemInfo } from "svebaselib";
import { Action, IGameHandler } from "./SVEGameHandlerBase";
import { SVEGameServer } from "./SVEGameServer";
import { SVEPlayer } from "./SVEPlayer";

export enum GameState {
    UnReady = 0,
    Ready,
    Playing,
    Finished
}

export interface SVEGameInfo {
    name: string;
    id: number;
    host: SVEAccount;
    maxPlayers: number;
    minPlayers: number;
    playersCount: number;
    state: GameState;
}

export enum GameRejectReason {
    GameFull = 0,
    GameEnded,
    ServerError
}

export abstract class SVEGame implements SVEGameInfo, IGameHandler {
    public name: string;
    public id: number;
    public host: SVEAccount;
    public maxPlayers: number;
    public minPlayers: number;
    public playersCount: number;
    public state: GameState;
    protected localPlayer: SVEPlayer;
    protected socket: WebSocket;

    constructor(player: SVEAccount, info: SVEGameInfo) {
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
            self.onAbort(event.code as GameRejectReason);
        };

        this.socket.onmessage = function (event) {
            self.handleIncoming(JSON.parse(event.data) as Action); 
        };
    }

    protected abstract onJoin(): void;
    protected abstract onAbort(reason: GameRejectReason): void;
    protected abstract handleIncoming(action: Action): void;
    public handle(action: Action): void {
        this.socket.send(JSON.stringify(action));
    }

    public getLocalPlayerName(): string {
        return this.localPlayer.getName();
    }

    public getLocalPlayer(): SVEPlayer {
        return this.localPlayer;
    }

    public endGame(): void {
        this.state = GameState.Finished;
        SVEGameServer.updateGame(this, this.localPlayer);
    }

    public abstract getControllers(): any[];
}