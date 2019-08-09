"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAction_1 = require("./BaseAction");
class SelectingAction extends BaseAction_1.BaseAction {
    constructor(mouseX, mouseY) {
        super(mouseX, mouseY);
        this.mouseX2 = mouseX;
        this.mouseY2 = mouseY;
    }
    getBoxDimensions() {
        return {
            left: this.mouseX2 > this.mouseX ? this.mouseX : this.mouseX2,
            top: this.mouseY2 > this.mouseY ? this.mouseY : this.mouseY2,
            width: Math.abs(this.mouseX2 - this.mouseX),
            height: Math.abs(this.mouseY2 - this.mouseY),
            right: this.mouseX2 < this.mouseX ? this.mouseX : this.mouseX2,
            bottom: this.mouseY2 < this.mouseY ? this.mouseY : this.mouseY2
        };
    }
    containsElement(x, y, diagramModel) {
        var z = diagramModel.getZoomLevel() / 100.0;
        let dimensions = this.getBoxDimensions();
        return (x * z + diagramModel.getOffsetX() > dimensions.left &&
            x * z + diagramModel.getOffsetX() < dimensions.right &&
            y * z + diagramModel.getOffsetY() > dimensions.top &&
            y * z + diagramModel.getOffsetY() < dimensions.bottom);
    }
}
exports.SelectingAction = SelectingAction;
//# sourceMappingURL=SelectingAction.js.map