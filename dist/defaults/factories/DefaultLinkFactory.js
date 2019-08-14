"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const DefaultLinkWidget_1 = require("../widgets/DefaultLinkWidget");
const AbstractLinkFactory_1 = require("../../factories/AbstractLinkFactory");
const DefaultLinkModel_1 = require("../models/DefaultLinkModel");
/**
 * @author Dylan Vorster
 */
class DefaultLinkFactory extends AbstractLinkFactory_1.AbstractLinkFactory {
    constructor() {
        super("default");
    }
    generateReactWidget(diagramEngine, link) {
        return React.createElement(DefaultLinkWidget_1.DefaultLinkWidget, {
            link: link,
            diagramEngine: diagramEngine
        });
    }
    getNewInstance(initialConfig) {
        return new DefaultLinkModel_1.DefaultLinkModel();
    }
    generateLinkSegment(model, widget, selected, path) {
        return (React.createElement("path", { className: selected ? widget.bem("--path-selected") : "", strokeWidth: model.width, stroke: model.color, d: path }));
    }
}
exports.DefaultLinkFactory = DefaultLinkFactory;
//# sourceMappingURL=DefaultLinkFactory.js.map