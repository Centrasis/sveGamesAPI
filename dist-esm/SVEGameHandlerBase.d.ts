export declare enum ActionType {
    Spawn = 0,
    Update = 1,
    Message = 2,
    GameState = 3,
    InvokeController = 4,
    Event = 5
}
export interface Action {
    type: ActionType;
    info: any;
    invoker: string;
}
export interface IGameHandler {
    handle(action: Action): void;
    getLocalPlayerName(): string;
    getControllers(): any[];
}
//# sourceMappingURL=SVEGameHandlerBase.d.ts.map