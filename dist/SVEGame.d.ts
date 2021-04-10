import { SVEAccount } from "svebaselib";
import { Action, IGameHandler } from "./SVEGameHandlerBase";
import { SVEPlayer } from "./SVEPlayer";
export declare enum GameState {
    Waiting = 0,
    Started = 1,
    Finished = 2
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
export declare enum GameRejectReason {
    GameFull = 0,
    GameEnded = 1,
    ServerError = 2
}
export declare abstract class SVEGame implements SVEGameInfo, IGameHandler {
    name: string;
    id: number;
    host: SVEAccount;
    maxPlayers: number;
    minPlayers: number;
    playersCount: number;
    state: GameState;
    protected localPlayer: SVEPlayer;
    protected socket: WebSocket;
    constructor(player: SVEAccount, info: SVEGameInfo);
    protected abstract onJoin(): void;
    protected abstract onAbort(reason: GameRejectReason): void;
    handle(action: Action): void;
    getLocalPlayerName(): string;
    getLocalPlayer(): SVEPlayer;
    abstract getControllers(): any[];
}
//# sourceMappingURL=SVEGame.d.ts.map