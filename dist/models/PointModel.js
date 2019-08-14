"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("./BaseModel");
const _ = require("lodash");
class PointModel extends BaseModel_1.BaseModel {
    constructor(link, points) {
        super();
        this.x = points.x;
        this.y = points.y;
        this.parent = link;
    }
    getSelectedEntities() {
        if (super.isSelected() && !this.isConnectedToPort()) {
            return [this];
        }
        return [];
    }
    isConnectedToPort() {
        return this.parent.getPortForPoint(this) !== null;
    }
    getLink() {
        return this.getParent();
    }
    deSerialize(ob, engine) {
        super.deSerialize(ob, engine);
        this.x = ob.x;
        this.y = ob.y;
    }
    serialize() {
        return _.merge(super.serialize(), {
            x: this.x,
            y: this.y
        });
    }
    remove() {
        //clear references
        if (this.parent) {
            this.parent.removePoint(this);
        }
        super.remove();
    }
    updateLocation(points) {
        this.x = points.x;
        this.y = points.y;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    isLocked() {
        return super.isLocked() || this.getParent().isLocked();
    }
}
exports.PointModel = PointModel;
//# sourceMappingURL=PointModel.js.map