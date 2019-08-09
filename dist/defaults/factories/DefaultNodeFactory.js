"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultNodeModel_1 = require("../models/DefaultNodeModel");
const React = require("react");
const DefaultNodeWidget_1 = require("../widgets/DefaultNodeWidget");
const AbstractNodeFactory_1 = require("../../factories/AbstractNodeFactory");
/**
 * @author Dylan Vorster
 */
class DefaultNodeFactory extends AbstractNodeFactory_1.AbstractNodeFactory {
    constructor() {
        super("default");
    }
    generateReactWidget(diagramEngine, node) {
        return React.createElement(DefaultNodeWidget_1.DefaultNodeWidget, {
            node: node,
            diagramEngine: diagramEngine
        });
    }
    getNewInstance(initialConfig) {
        return new DefaultNodeModel_1.DefaultNodeModel();
    }
}
exports.DefaultNodeFactory = DefaultNodeFactory;
//# sourceMappingURL=DefaultNodeFactory.js.map