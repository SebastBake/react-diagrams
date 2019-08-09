"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("./BaseModel");
const _ = require("lodash");
class LabelModel extends BaseModel_1.BaseModel {
    constructor(type, id) {
        super(type, id);
        this.offsetX = 0;
        this.offsetY = 0;
    }
    deSerialize(ob, engine) {
        super.deSerialize(ob, engine);
        this.offsetX = ob.offsetX;
        this.offsetY = ob.offsetY;
    }
    serialize() {
        return _.merge(super.serialize(), {
            offsetX: this.offsetX,
            offsetY: this.offsetY
        });
    }
}
exports.LabelModel = LabelModel;
//# sourceMappingURL=LabelModel.js.map