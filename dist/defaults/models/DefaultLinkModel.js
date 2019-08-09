"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Dylan Vorster
 */
const LinkModel_1 = require("../../models/LinkModel");
const _ = require("lodash");
const DefaultLabelModel_1 = require("./DefaultLabelModel");
const LabelModel_1 = require("../../models/LabelModel");
class DefaultLinkModel extends LinkModel_1.LinkModel {
    constructor(type = "default") {
        super(type);
        this.color = "rgba(255,255,255,0.5)";
        this.width = 3;
        this.curvyness = 50;
    }
    serialize() {
        return _.merge(super.serialize(), {
            width: this.width,
            color: this.color,
            curvyness: this.curvyness
        });
    }
    deSerialize(ob, engine) {
        super.deSerialize(ob, engine);
        this.color = ob.color;
        this.width = ob.width;
        this.curvyness = ob.curvyness;
    }
    addLabel(label) {
        if (label instanceof LabelModel_1.LabelModel) {
            return super.addLabel(label);
        }
        let labelOb = new DefaultLabelModel_1.DefaultLabelModel();
        labelOb.setLabel(label);
        return super.addLabel(labelOb);
    }
    setWidth(width) {
        this.width = width;
        this.iterateListeners((listener, event) => {
            if (listener.widthChanged) {
                listener.widthChanged(Object.assign({}, event, { width: width }));
            }
        });
    }
    setColor(color) {
        this.color = color;
        this.iterateListeners((listener, event) => {
            if (listener.colorChanged) {
                listener.colorChanged(Object.assign({}, event, { color: color }));
            }
        });
    }
}
exports.DefaultLinkModel = DefaultLinkModel;
//# sourceMappingURL=DefaultLinkModel.js.map