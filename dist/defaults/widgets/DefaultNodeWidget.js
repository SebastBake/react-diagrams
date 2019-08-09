"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const _ = require("lodash");
const DefaultPortLabelWidget_1 = require("./DefaultPortLabelWidget");
const BaseWidget_1 = require("../../widgets/BaseWidget");
/**
 * @author Dylan Vorster
 */
class DefaultNodeWidget extends BaseWidget_1.BaseWidget {
    constructor(props) {
        super("srd-default-node", props);
        this.state = {};
    }
    generatePort(port) {
        return React.createElement(DefaultPortLabelWidget_1.DefaultPortLabel, { model: port, key: port.id });
    }
    render() {
        return (React.createElement("div", Object.assign({}, this.getProps(), { style: { background: this.props.node.color } }),
            React.createElement("div", { className: this.bem("__title") },
                React.createElement("div", { className: this.bem("__name") }, this.props.node.name)),
            React.createElement("div", { className: this.bem("__ports") },
                React.createElement("div", { className: this.bem("__in") }, _.map(this.props.node.getInPorts(), this.generatePort.bind(this))),
                React.createElement("div", { className: this.bem("__out") }, _.map(this.props.node.getOutPorts(), this.generatePort.bind(this))))));
    }
}
exports.DefaultNodeWidget = DefaultNodeWidget;
//# sourceMappingURL=DefaultNodeWidget.js.map