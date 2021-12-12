import { SVEAccount, SVESystemInfo } from "svebaselib";
import { Action, IGameHandler } from "./SVEGameHandlerBase";
import { SVEGameServer } from "./SVEGameServer";
import { SVEPlayer } from "./SVEPlayer";
import SocketIO, {Socket} from "socket.io-client";

export enum GameState {
    UnReady = 0,
    Ready,
    Playing,
    Finished
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

export enum GameRejectReason {
    GameFull = 0,
    GameEnded,
    ServerError
}

export abstract class SVEGame implements SVEGameInfo, IGameHandler {
    public name: string;
    public type: string;
    public assetPath: string;
    public id: number;
    public host: SVEAccount | string;
    public maxPlayers: number;
    public minPlayers: number;
    public playersCount: number;
    public state: GameState;
    protected localPlayer: SVEPlayer;
    protected socket: Socket;

    protected static str2GameRejectReason(str: string): GameRejectReason {
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
    }

    constructor(player: SVEAccount, info: SVEGameInfo) {
        this.localPlayer = new SVEPlayer(player);
        this.id = info.id;
        this.name = info.name;
        this.host = info.host;
        this.maxPlayers = info.maxPlayers;
        this.minPlayers = info.minPlayers;
        this.playersCount = info.playersCount;
        this.state = info.state;
        this.type = info.type;
        this.assetPath = info.assetPath;

        const target = SVESystemInfo.getGameRoot(true);
        console.log("Attempting to connect with game at:", target);
        this.socket = SocketIO(target, {
            extraHeaders: {
                sessionID: player.getSessionID(),
                gid: this.name
            }
        });
        const self = this;
        this.socket.on("connect", () => {
            self.onJoin();
        });

        this.socket.on("error", (event) => {
            console.log("Socket error: ", event);
            self.onAbort(GameRejectReason.ServerError);
        });

        this.socket.on("disconnect", (event) => {
            self.onAbort(SVEGame.str2GameRejectReason(event));
        });

        this.socket.on("message", (event) => {
            self.handleIncoming(JSON.parse(event) as Action); 
        });

        this.socket.connect();
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

    public startGame(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.state = GameState.Playing;
            SVEGameServer.updateGame(this, this.localPlayer).then(()=> {
                resolve();
            }, err => reject(err))
        });
    }

    public getMetaInfos(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            fetch(SVESystemInfo.getGameRoot() + "/meta/" + this.name + "?sessionID=" + encodeURI(this.localPlayer.getSessionID()),
            {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                if(res.status < 400) {
                    res.json().then(j => {
                        resolve(j as any);
                    }, err => reject(err));
                } else {
                    reject();
                }
            }, err => reject(err));
        }); 
    }

    public setMetaInfos(meta: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fetch(SVESystemInfo.getGameRoot() + "/meta/" + this.name + "?sessionID=" + encodeURI(this.localPlayer.getSessionID()),
            {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(meta)
            }).then((res) => {
                if(res.status < 300) {
                    resolve();
                } else {
                    reject();
                }
            }, err => reject(err));
        }); 
    }

    public setReady() {
        this.state = GameState.Ready;
        SVEGameServer.updateGame(this, this.localPlayer);
    }

    public abstract getControllers(): any[];
}