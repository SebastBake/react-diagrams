"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class BaseWidget extends React.Component {
    constructor(name, props) {
        super(props);
        this.className = name;
    }
    bem(selector) {
        return (this.props.baseClass || this.className) + selector + " ";
    }
    getClassName() {
        return ((this.props.baseClass || this.className) + " " + (this.props.className ? this.props.className + " " : ""));
    }
    getProps() {
        return Object.assign({}, (this.props.extraProps || {}), { className: this.getClassName() });
    }
}
exports.BaseWidget = BaseWidget;
//# sourceMappingURL=BaseWidget.js.map