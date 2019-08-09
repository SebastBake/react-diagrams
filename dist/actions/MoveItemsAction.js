"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAction_1 = require("./BaseAction");
class MoveItemsAction extends BaseAction_1.BaseAction {
    constructor(mouseX, mouseY, diagramEngine) {
        super(mouseX, mouseY);
        this.moved = false;
        diagramEngine.enableRepaintEntities(diagramEngine.getDiagramModel().getSelectedItems());
        var selectedItems = diagramEngine.getDiagramModel().getSelectedItems();
        //dont allow items which are locked to move
        selectedItems = selectedItems.filter(item => {
            return !diagramEngine.isModelLocked(item);
        });
        this.selectionModels = selectedItems.map((item) => {
            return {
                model: item,
                initialX: item.x,
                initialY: item.y
            };
        });
    }
}
exports.MoveItemsAction = MoveItemsAction;
//# sourceMappingURL=MoveItemsAction.js.map