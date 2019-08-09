"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseWidget_1 = require("./BaseWidget");
/**
 * @author Dylan Vorster
 */
class LinkWidget extends BaseWidget_1.BaseWidget {
    constructor(props) {
        super("srd-link", props);
        this.state = {};
    }
    shouldComponentUpdate() {
        return this.props.diagramEngine.canEntityRepaint(this.props.link);
    }
    render() {
        return this.props.children;
    }
}
exports.LinkWidget = LinkWidget;
//# sourceMappingURL=LinkWidget.js.map