"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const LinkWidget_1 = require("../LinkWidget");
const _ = require("lodash");
const BaseWidget_1 = require("../BaseWidget");
/**
 * @author Dylan Vorster
 */
class LinkLayerWidget extends BaseWidget_1.BaseWidget {
    constructor(props) {
        super("srd-link-layer", props);
        this.state = {};
    }
    render() {
        var diagramModel = this.props.diagramEngine.getDiagramModel();
        return (React.createElement("svg", Object.assign({}, this.getProps(), { style: {
                transform: "translate(" +
                    diagramModel.getOffsetX() +
                    "px," +
                    diagramModel.getOffsetY() +
                    "px) scale(" +
                    diagramModel.getZoomLevel() / 100.0 +
                    ")"
            } }), //only perform these actions when we have a diagram
        this.props.diagramEngine.canvas &&
            _.map(diagramModel.getLinks(), link => {
                if (this.props.diagramEngine.nodesRendered &&
                    !this.props.diagramEngine.linksThatHaveInitiallyRendered[link.id]) {
                    if (link.sourcePort !== null) {
                        try {
                            const portCenter = this.props.diagramEngine.getPortCenter(link.sourcePort);
                            link.points[0].updateLocation(portCenter);
                            const portCoords = this.props.diagramEngine.getPortCoords(link.sourcePort);
                            link.sourcePort.updateCoords(portCoords);
                            this.props.diagramEngine.linksThatHaveInitiallyRendered[link.id] = true;
                        }
                        catch (ignore) {
                            /*noop*/
                        }
                    }
                    if (link.targetPort !== null) {
                        try {
                            const portCenter = this.props.diagramEngine.getPortCenter(link.targetPort);
                            _.last(link.points).updateLocation(portCenter);
                            const portCoords = this.props.diagramEngine.getPortCoords(link.targetPort);
                            link.targetPort.updateCoords(portCoords);
                            this.props.diagramEngine.linksThatHaveInitiallyRendered[link.id] = true;
                        }
                        catch (ignore) {
                            /*noop*/
                        }
                    }
                }
                //generate links
                var generatedLink = this.props.diagramEngine.generateWidgetForLink(link);
                if (!generatedLink) {
                    throw new Error(`no link generated for type: ${link.getType()}`);
                }
                return (React.createElement(LinkWidget_1.LinkWidget, { key: link.getID(), link: link, diagramEngine: this.props.diagramEngine }, React.cloneElement(generatedLink, {
                    pointAdded: this.props.pointAdded
                })));
            })));
    }
}
exports.LinkLayerWidget = LinkLayerWidget;
//# sourceMappingURL=LinkLayerWidget.js.map