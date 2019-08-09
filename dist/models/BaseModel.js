"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEntity_1 = require("../BaseEntity");
const _ = require("lodash");
/**
 * @author Dylan Vorster
 */
class BaseModel extends BaseEntity_1.BaseEntity {
    constructor(type, id) {
        super(id);
        this.type = type;
        this.selected = false;
    }
    getParent() {
        return this.parent;
    }
    setParent(parent) {
        this.parent = parent;
    }
    getSelectedEntities() {
        if (this.isSelected()) {
            return [this];
        }
        return [];
    }
    deSerialize(ob, engine) {
        super.deSerialize(ob, engine);
        this.type = ob.type;
        this.selected = ob.selected;
    }
    serialize() {
        return _.merge(super.serialize(), {
            type: this.type,
            selected: this.selected
        });
    }
    getType() {
        return this.type;
    }
    getID() {
        return this.id;
    }
    isSelected() {
        return this.selected;
    }
    setSelected(selected = true) {
        this.selected = selected;
        this.iterateListeners((listener, event) => {
            if (listener.selectionChanged) {
                listener.selectionChanged(Object.assign({}, event, { isSelected: selected }));
            }
        });
    }
    remove() {
        this.iterateListeners((listener, event) => {
            if (listener.entityRemoved) {
                listener.entityRemoved(event);
            }
        });
    }
}
exports.BaseModel = BaseModel;
//# sourceMappingURL=BaseModel.js.map