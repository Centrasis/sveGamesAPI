export enum ActionType {
    Spawn,
    Update,
    Message,
    GameState,
    InvokeController,
    Event
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