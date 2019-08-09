"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DefaultPortModel_1 = require("../models/DefaultPortModel");
const AbstractPortFactory_1 = require("../../factories/AbstractPortFactory");
class DefaultPortFactory extends AbstractPortFactory_1.AbstractPortFactory {
    constructor() {
        super("default");
    }
    getNewInstance(initialConfig) {
        return new DefaultPortModel_1.DefaultPortModel(true, "unknown");
    }
}
exports.DefaultPortFactory = DefaultPortFactory;
//# sourceMappingURL=DefaultPortFactory.js.map