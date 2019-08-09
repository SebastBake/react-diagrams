"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const BaseWidget_1 = require("./BaseWidget");
/**
 * @author Dylan Vorster
 */
class PortWidget extends BaseWidget_1.BaseWidget {
    constructor(props) {
        super("srd-port", props);
        this.state = {
            selected: false
        };
    }
    getClassName() {
        return "port " + super.getClassName() + (this.state.selected ? this.bem("--selected") : "");
    }
    render() {
        return (React.createElement("div", Object.assign({}, this.getProps(), { onMouseEnter: () => {
                this.setState({ selected: true });
            }, onMouseLeave: () => {
                this.setState({ selected: false });
            }, "data-name": this.props.name, "data-nodeid": this.props.node.getID() })));
    }
}
exports.PortWidget = PortWidget;
//# sourceMappingURL=PortWidget.js.map