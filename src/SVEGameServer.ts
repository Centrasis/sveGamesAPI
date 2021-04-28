import { rejects } from "assert";
import { encode } from "punycode";
import { SVEAccount, SVESystemInfo } from "svebaselib";
import { getEmitHelpers, hasOnlyExpressionInitializer } from "typescript";
import { SVEGame, SVEGameInfo } from "./SVEGame";
import { SVEPlayer } from "./SVEPlayer";

export class SVEGameServer {
    public static listGames(requester: SVEAccount): Promise<SVEGameInfo[]> {
        return new Promise<SVEGameInfo[]>((resolve, reject) => {
            fetch(SVESystemInfo.getGameRoot() + "/list?sessionID=" + encodeURI(requester.getInitializer().sessionID),
            {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                if(res.status < 400) {
                    res.json().then(j => {
                        resolve(j as SVEGameInfo[]);
                    }, err => reject(err));
                } else {
                    reject();
                }
            }, err => reject(err));
        });
    }

    public static listGameTypes(requester: SVEAccount): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fetch(SVESystemInfo.getGameRoot() + "/list/types?sessionID=" + encodeURI(requester.getInitializer().sessionID),
            {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                if(res.status < 400) {
                    res.json().then(j => {
                        resolve(j as string[]);
                    }, err => reject(err));
                } else {
                    reject();
                }
            }, err => reject(err));
        });
    }

    public static listPlayers(requester: SVEAccount, gameName: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fetch(SVESystemInfo.getGameRoot() + "/players/" + gameName + "?sessionID=" + encodeURI(requester.getInitializer().sessionID),
            {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                if(res.status < 400) {
                    res.json().then(j => {
                        resolve(j as string[]);
                    }, err => reject(err));
                } else {
                    reject();
                }
            }, err => reject(err));
        });
    }

    public static hostGame(gi: SVEGameInfo): Promise<SVEGameInfo> {
        return new Promise<SVEGameInfo>((resolve, reject) => {
            fetch(SVESystemInfo.getGameRoot() + "/new?sessionID=" + encodeURI((gi.host as SVEAccount).getInitializer().sessionID),
            {
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
                } as any
            }).then((res) => {
                if(res.status < 400) {
                    resolve(gi);
                } else {
                    reject();
                }
            }, err => reject(err));
        });
    }

    public static updateGame(gi: SVEGameInfo, player: SVEPlayer): Promise<SVEGameInfo> {
        return new Promise<SVEGameInfo>((resolve, reject) => {
            fetch(SVESystemInfo.getGameRoot() + "/update/" + encodeURI(gi.name) + "?sessionID=" + encodeURI(player.getInitializer().sessionID),
            {
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
                } as any
            }).then((res) => {
                if(res.status < 400) {
                    resolve(gi);
                } else {
                    reject();
                }
            }, err => reject(err));
        });
    }
}