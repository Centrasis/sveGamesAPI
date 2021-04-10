export var ActionType;
(function (ActionType) {
    ActionType[ActionType["Spawn"] = 0] = "Spawn";
    ActionType[ActionType["Update"] = 1] = "Update";
    ActionType[ActionType["Message"] = 2] = "Message";
    ActionType[ActionType["GameState"] = 3] = "GameState";
    ActionType[ActionType["InvokeController"] = 4] = "InvokeController";
    ActionType[ActionType["Event"] = 5] = "Event";
})(ActionType || (ActionType = {}));
