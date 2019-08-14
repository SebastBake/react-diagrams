"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const PortWidget_1 = require("../../widgets/PortWidget");
const BaseWidget_1 = require("../../widgets/BaseWidget");
/**
 * @author Dylan Vorster
 */
class DefaultPortLabel extends BaseWidget_1.BaseWidget {
    constructor(props) {
        super("srd-default-port", props);
    }
    getClassName() {
        return super.getClassName() + (this.props.model.in ? this.bem("--in") : this.bem("--out"));
    }
    render() {
        var port = React.createElement(PortWidget_1.PortWidget, { node: this.props.model.getParent(), name: this.props.model.name });
        var label = React.createElement("div", { className: "name" }, this.props.model.label);
        return (React.createElement("div", Object.assign({}, this.getProps()),
            this.props.model.in ? port : label,
            this.props.model.in ? label : port));
    }
}
exports.DefaultPortLabel = DefaultPortLabel;
//# sourceMappingURL=DefaultPortLabelWidget.js.map