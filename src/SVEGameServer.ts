import { rejects } from "assert";
import { encode } from "punycode";
import { SVEAccount, SVESystemInfo } from "svebaselib";
import { hasOnlyExpressionInitializer } from "typescript";
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

    public static hostGame(gi: SVEGameInfo): Promise<SVEGameInfo> {
        return new Promise<SVEGameInfo>((resolve, reject) => {
            fetch(SVESystemInfo.getGameRoot() + "/new?sessionID=" + encodeURI(gi.host.getInitializer().sessionID),
            {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: gi as any
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
                body: gi as any
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