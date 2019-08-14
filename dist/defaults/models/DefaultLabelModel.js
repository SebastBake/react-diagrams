"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LabelModel_1 = require("../../models/LabelModel");
const _ = require("lodash");
class DefaultLabelModel extends LabelModel_1.LabelModel {
    constructor() {
        super("default");
        this.offsetY = -23;
    }
    setLabel(label) {
        this.label = label;
    }
    deSerialize(ob, engine) {
        super.deSerialize(ob, engine);
        this.label = ob.label;
    }
    serialize() {
        return _.merge(super.serialize(), {
            label: this.label
        });
    }
}
exports.DefaultLabelModel = DefaultLabelModel;
//# sourceMappingURL=DefaultLabelModel.js.map