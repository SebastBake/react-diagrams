"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const BaseWidget_1 = require("../../widgets/BaseWidget");
class DefaultLabelWidget extends BaseWidget_1.BaseWidget {
    constructor(props) {
        super("srd-default-label", props);
    }
    render() {
        return React.createElement("div", Object.assign({}, this.getProps()), this.props.model.label);
    }
}
exports.DefaultLabelWidget = DefaultLabelWidget;
//# sourceMappingURL=DefaultLabelWidget.js.map