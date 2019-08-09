"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const PortModel_1 = require("../../models/PortModel");
const DefaultLinkModel_1 = require("./DefaultLinkModel");
class DefaultPortModel extends PortModel_1.PortModel {
    constructor(isInput, name, label = null, id) {
        super(name, "default", id);
        this.in = isInput;
        this.label = label || name;
    }
    deSerialize(object, engine) {
        super.deSerialize(object, engine);
        this.in = object.in;
        this.label = object.label;
    }
    serialize() {
        return _.merge(super.serialize(), {
            in: this.in,
            label: this.label
        });
    }
    link(port) {
        let link = this.createLinkModel();
        link.setSourcePort(this);
        link.setTargetPort(port);
        return link;
    }
    canLinkToPort(port) {
        if (port instanceof DefaultPortModel) {
            return this.in !== port.in;
        }
        return true;
    }
    createLinkModel() {
        let link = super.createLinkModel();
        return link || new DefaultLinkModel_1.DefaultLinkModel();
    }
}
exports.DefaultPortModel = DefaultPortModel;
//# sourceMappingURL=DefaultPortModel.js.map