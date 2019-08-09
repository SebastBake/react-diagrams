"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const _ = require("lodash");
const NodeWidget_1 = require("../NodeWidget");
const BaseWidget_1 = require("../BaseWidget");
class NodeLayerWidget extends BaseWidget_1.BaseWidget {
    constructor(props) {
        super("srd-node-layer", props);
        this.updateNodeDimensions = () => {
            if (!this.props.diagramEngine.nodesRendered) {
                const diagramModel = this.props.diagramEngine.getDiagramModel();
                _.map(diagramModel.getNodes(), node => {
                    node.updateDimensions(this.props.diagramEngine.getNodeDimensions(node));
                });
            }
        };
        this.state = {};
    }
    componentDidUpdate() {
        this.updateNodeDimensions();
        this.props.diagramEngine.nodesRendered = true;
    }
    render() {
        var diagramModel = this.props.diagramEngine.getDiagramModel();
        return (React.createElement("div", Object.assign({}, this.getProps(), { style: {
                transform: "translate(" +
                    diagramModel.getOffsetX() +
                    "px," +
                    diagramModel.getOffsetY() +
                    "px) scale(" +
                    diagramModel.getZoomLevel() / 100.0 +
                    ")"
            } }), _.map(diagramModel.getNodes(), (node) => {
            return React.createElement(NodeWidget_1.NodeWidget, {
                diagramEngine: this.props.diagramEngine,
                key: node.id,
                node: node
            }, this.props.diagramEngine.generateWidgetForNode(node));
        })));
    }
}
exports.NodeLayerWidget = NodeLayerWidget;
//# sourceMappingURL=NodeLayerWidget.js.map