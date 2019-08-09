"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const AbstractLabelFactory_1 = require("../../factories/AbstractLabelFactory");
const DefaultLabelModel_1 = require("../models/DefaultLabelModel");
const DefaultLabelWidget_1 = require("../widgets/DefaultLabelWidget");
/**
 * @author Dylan Vorster
 */
class DefaultLabelFactory extends AbstractLabelFactory_1.AbstractLabelFactory {
    constructor() {
        super("default");
    }
    generateReactWidget(diagramEngine, label) {
        return React.createElement(DefaultLabelWidget_1.DefaultLabelWidget, { model: label });
    }
    getNewInstance(initialConfig) {
        return new DefaultLabelModel_1.DefaultLabelModel();
    }
}
exports.DefaultLabelFactory = DefaultLabelFactory;
//# sourceMappingURL=DefaultLabelFactory.js.map