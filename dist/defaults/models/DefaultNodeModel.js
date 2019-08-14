"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultPortModel_1 = require("./DefaultPortModel");
const _ = require("lodash");
const NodeModel_1 = require("../../models/NodeModel");
const Toolkit_1 = require("../../Toolkit");
/**
 * @author Dylan Vorster
 */
class DefaultNodeModel extends NodeModel_1.NodeModel {
    constructor(name = "Untitled", color = "rgb(0,192,255)") {
        super("default");
        this.name = name;
        this.color = color;
    }
    addInPort(label) {
        return this.addPort(new DefaultPortModel_1.DefaultPortModel(true, Toolkit_1.Toolkit.UID(), label));
    }
    addOutPort(label) {
        return this.addPort(new DefaultPortModel_1.DefaultPortModel(false, Toolkit_1.Toolkit.UID(), label));
    }
    deSerialize(object, engine) {
        super.deSerialize(object, engine);
        this.name = object.name;
        this.color = object.color;
    }
    serialize() {
        return _.merge(super.serialize(), {
            name: this.name,
            color: this.color
        });
    }
    getInPorts() {
        return _.filter(this.ports, portModel => {
            return portModel.in;
        });
    }
    getOutPorts() {
        return _.filter(this.ports, portModel => {
            return !portModel.in;
        });
    }
}
exports.DefaultNodeModel = DefaultNodeModel;
//# sourceMappingURL=DefaultNodeModel.js.map