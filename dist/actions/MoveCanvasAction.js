"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAction_1 = require("./BaseAction");
class MoveCanvasAction extends BaseAction_1.BaseAction {
    constructor(mouseX, mouseY, diagramModel) {
        super(mouseX, mouseY);
        this.initialOffsetX = diagramModel.getOffsetX();
        this.initialOffsetY = diagramModel.getOffsetY();
    }
}
exports.MoveCanvasAction = MoveCanvasAction;
//# sourceMappingURL=MoveCanvasAction.js.map