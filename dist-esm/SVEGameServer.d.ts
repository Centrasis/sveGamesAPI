import { SVEAccount } from "svebaselib";
import { SVEGameInfo } from "./SVEGame";
import { SVEPlayer } from "./SVEPlayer";
export declare class SVEGameServer {
    static listGames(requester: SVEAccount): Promise<SVEGameInfo[]>;
    static listGameTypes(requester: SVEAccount): Promise<string[]>;
    static listPlayers(requester: SVEAccount, gameName: string): Promise<string[]>;
    static hostGame(gi: SVEGameInfo): Promise<SVEGameInfo>;
    static updateGame(gi: SVEGameInfo, player: SVEPlayer): Promise<SVEGameInfo>;
}
//# sourceMappingURL=SVEGameServer.d.ts.map