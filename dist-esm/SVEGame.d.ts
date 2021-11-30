import { SVEAccount } from "svebaselib";
import { Action, IGameHandler } from "./SVEGameHandlerBase";
import { SVEPlayer } from "./SVEPlayer";
export declare enum GameState {
    UnReady = 0,
    Ready = 1,
    Playing = 2,
    Finished = 3
}
export interface SVEStaticGameInfo {
    assetPath: string;
    type: string;
    maxPlayers: number;
    minPlayers: number;
}
export interface SVEGameInfo extends SVEStaticGameInfo {
    name: string;
    id: number;
    host: SVEAccount | string;
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
    type: string;
    assetPath: string;
    id: number;
    host: SVEAccount | string;
    maxPlayers: number;
    minPlayers: number;
    playersCount: number;
    state: GameState;
    protected localPlayer: SVEPlayer;
    protected socket: WebSocket;
    constructor(player: SVEAccount, info: SVEGameInfo);
    protected abstract onJoin(): void;
    protected abstract onAbort(reason: GameRejectReason): void;
    protected abstract handleIncoming(action: Action): void;
    handle(action: Action): void;
    getLocalPlayerName(): string;
    getLocalPlayer(): SVEPlayer;
    endGame(): void;
    startGame(): Promise<void>;
    getMetaInfos(): Promise<any>;
    setMetaInfos(meta: any): Promise<void>;
    setReady(): void;
    abstract getControllers(): any[];
}
//# sourceMappingURL=SVEGame.d.ts.map