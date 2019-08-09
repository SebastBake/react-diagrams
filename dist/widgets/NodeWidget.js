"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const BaseWidget_1 = require("./BaseWidget");
/**
 * @author Dylan Vorster
 */
class NodeWidget extends BaseWidget_1.BaseWidget {
    constructor(props) {
        super("srd-node", props);
        this.state = {};
    }
    shouldComponentUpdate() {
        return this.props.diagramEngine.canEntityRepaint(this.props.node);
    }
    getClassName() {
        return "node " + super.getClassName() + (this.props.node.isSelected() ? this.bem("--selected") : "");
    }
    render() {
        return (React.createElement("div", Object.assign({}, this.getProps(), { "data-nodeid": this.props.node.id, style: {
                top: this.props.node.y,
                left: this.props.node.x
            } }), this.props.children));
    }
}
exports.NodeWidget = NodeWidget;
//# sourceMappingURL=NodeWidget.js.map