"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseAction {
    constructor(mouseX, mouseY) {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
        this.ms = new Date().getTime();
    }
}
exports.BaseAction = BaseAction;
//# sourceMappingURL=BaseAction.js.map