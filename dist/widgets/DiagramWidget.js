"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const _ = require("lodash");
const LinkLayerWidget_1 = require("./layers/LinkLayerWidget");
const NodeLayerWidget_1 = require("./layers/NodeLayerWidget");
const Toolkit_1 = require("../Toolkit");
const MoveCanvasAction_1 = require("../actions/MoveCanvasAction");
const MoveItemsAction_1 = require("../actions/MoveItemsAction");
const SelectingAction_1 = require("../actions/SelectingAction");
const NodeModel_1 = require("../models/NodeModel");
const PointModel_1 = require("../models/PointModel");
const PortModel_1 = require("../models/PortModel");
const BaseWidget_1 = require("./BaseWidget");
/**
 * @author Dylan Vorster
 */
class DiagramWidget extends BaseWidget_1.BaseWidget {
    constructor(props) {
        super("srd-diagram", props);
        this.onKeyUpPointer = null;
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.state = {
            action: null,
            wasMoved: false,
            renderedNodes: false,
            windowListener: null,
            diagramEngineListener: null,
            document: null
        };
    }
    componentWillUnmount() {
        this.props.diagramEngine.removeListener(this.state.diagramEngineListener);
        this.props.diagramEngine.setCanvas(null);
        window.removeEventListener("keyup", this.onKeyUpPointer);
        window.removeEventListener("mouseUp", this.onMouseUp);
        window.removeEventListener("mouseMove", this.onMouseMove);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.diagramEngine !== nextProps.diagramEngine) {
            this.props.diagramEngine.removeListener(this.state.diagramEngineListener);
            const diagramEngineListener = nextProps.diagramEngine.addListener({
                repaintCanvas: () => this.forceUpdate()
            });
            this.setState({ diagramEngineListener });
        }
    }
    componentWillUpdate(nextProps) {
        if (this.props.diagramEngine.diagramModel.id !== nextProps.diagramEngine.diagramModel.id) {
            this.setState({ renderedNodes: false });
            nextProps.diagramEngine.diagramModel.rendered = true;
        }
        if (!nextProps.diagramEngine.diagramModel.rendered) {
            this.setState({ renderedNodes: false });
            nextProps.diagramEngine.diagramModel.rendered = true;
        }
    }
    componentDidUpdate() {
        if (!this.state.renderedNodes) {
            this.setState({
                renderedNodes: true
            });
        }
    }
    componentDidMount() {
        this.onKeyUpPointer = this.onKeyUp.bind(this);
        //add a keyboard listener
        this.setState({
            document: document,
            renderedNodes: true,
            diagramEngineListener: this.props.diagramEngine.addListener({
                repaintCanvas: () => {
                    this.forceUpdate();
                }
            })
        });
        window.addEventListener("keyup", this.onKeyUpPointer, false);
        // dont focus the window when in test mode - jsdom fails
        if (process.env.NODE_ENV !== "test") {
            window.focus();
        }
    }
    /**
     * Gets a model and element under the mouse cursor
     */
    getMouseElement(event) {
        var target = event.target;
        var diagramModel = this.props.diagramEngine.diagramModel;
        //is it a port
        var element = Toolkit_1.Toolkit.closest(target, ".port[data-name]");
        if (element) {
            var nodeElement = Toolkit_1.Toolkit.closest(target, ".node[data-nodeid]");
            return {
                model: diagramModel
                    .getNode(nodeElement.getAttribute("data-nodeid"))
                    .getPort(element.getAttribute("data-name")),
                element: element
            };
        }
        //look for a point
        element = Toolkit_1.Toolkit.closest(target, ".point[data-id]");
        if (element) {
            return {
                model: diagramModel
                    .getLink(element.getAttribute("data-linkid"))
                    .getPointModel(element.getAttribute("data-id")),
                element: element
            };
        }
        //look for a link
        element = Toolkit_1.Toolkit.closest(target, "[data-linkid]");
        if (element) {
            return {
                model: diagramModel.getLink(element.getAttribute("data-linkid")),
                element: element
            };
        }
        //look for a node
        element = Toolkit_1.Toolkit.closest(target, ".node[data-nodeid]");
        if (element) {
            return {
                model: diagramModel.getNode(element.getAttribute("data-nodeid")),
                element: element
            };
        }
        return null;
    }
    fireAction() {
        if (this.state.action && this.props.actionStillFiring) {
            this.props.actionStillFiring(this.state.action);
        }
    }
    stopFiringAction(shouldSkipEvent) {
        if (this.props.actionStoppedFiring && !shouldSkipEvent) {
            this.props.actionStoppedFiring(this.state.action);
        }
        this.setState({ action: null });
    }
    startFiringAction(action) {
        var setState = true;
        if (this.props.actionStartedFiring) {
            setState = this.props.actionStartedFiring(action);
        }
        if (setState) {
            this.setState({ action: action });
        }
    }
    onMouseMove(event) {
        var diagramEngine = this.props.diagramEngine;
        var diagramModel = diagramEngine.getDiagramModel();
        //select items so draw a bounding box
        if (this.state.action instanceof SelectingAction_1.SelectingAction) {
            var relative = diagramEngine.getRelativePoint(event.clientX, event.clientY);
            _.forEach(diagramModel.getNodes(), node => {
                if (this.state.action.containsElement(node.x, node.y, diagramModel)) {
                    node.setSelected(true);
                }
            });
            _.forEach(diagramModel.getLinks(), link => {
                var allSelected = true;
                _.forEach(link.points, point => {
                    if (this.state.action.containsElement(point.x, point.y, diagramModel)) {
                        point.setSelected(true);
                    }
                    else {
                        allSelected = false;
                    }
                });
                if (allSelected) {
                    link.setSelected(true);
                }
            });
            this.state.action.mouseX2 = relative.x;
            this.state.action.mouseY2 = relative.y;
            this.fireAction();
            this.setState({ action: this.state.action });
            return;
        }
        else if (this.state.action instanceof MoveItemsAction_1.MoveItemsAction) {
            let amountX = event.clientX - this.state.action.mouseX;
            let amountY = event.clientY - this.state.action.mouseY;
            let amountZoom = diagramModel.getZoomLevel() / 100;
            _.forEach(this.state.action.selectionModels, model => {
                // in this case we need to also work out the relative grid position
                if (model.model instanceof NodeModel_1.NodeModel ||
                    (model.model instanceof PointModel_1.PointModel && !model.model.isConnectedToPort())) {
                    model.model.x = diagramModel.getGridPosition(model.initialX + amountX / amountZoom);
                    model.model.y = diagramModel.getGridPosition(model.initialY + amountY / amountZoom);
                    if (model.model instanceof NodeModel_1.NodeModel) {
                        model.model.positionChanged();
                        // update port coordinates as well
                        _.forEach(model.model.getPorts(), port => {
                            const portCoords = this.props.diagramEngine.getPortCoords(port);
                            port.updateCoords(portCoords);
                        });
                    }
                    if (diagramEngine.isSmartRoutingEnabled()) {
                        diagramEngine.calculateRoutingMatrix();
                    }
                }
                else if (model.model instanceof PointModel_1.PointModel) {
                    // we want points that are connected to ports, to not necessarily snap to grid
                    // this stuff needs to be pixel perfect, dont touch it
                    model.model.x = model.initialX + diagramModel.getGridPosition(amountX / amountZoom);
                    model.model.y = model.initialY + diagramModel.getGridPosition(amountY / amountZoom);
                }
            });
            if (diagramEngine.isSmartRoutingEnabled()) {
                diagramEngine.calculateCanvasMatrix();
            }
            this.fireAction();
            if (!this.state.wasMoved) {
                this.setState({ wasMoved: true });
            }
            else {
                this.forceUpdate();
            }
        }
        else if (this.state.action instanceof MoveCanvasAction_1.MoveCanvasAction) {
            //translate the actual canvas
            if (this.props.allowCanvasTranslation) {
                diagramModel.setOffset(this.state.action.initialOffsetX + (event.clientX - this.state.action.mouseX), this.state.action.initialOffsetY + (event.clientY - this.state.action.mouseY));
                this.fireAction();
                this.forceUpdate();
            }
        }
    }
    onKeyUp(event) {
        //delete all selected
        if (this.props.deleteKeys.indexOf(event.keyCode) !== -1) {
            _.forEach(this.props.diagramEngine.getDiagramModel().getSelectedItems(), element => {
                //only delete items which are not locked
                if (!this.props.diagramEngine.isModelLocked(element)) {
                    element.remove();
                }
            });
            this.forceUpdate();
        }
    }
    onMouseUp(event) {
        var diagramEngine = this.props.diagramEngine;
        //are we going to connect a link to something?
        if (this.state.action instanceof MoveItemsAction_1.MoveItemsAction) {
            var element = this.getMouseElement(event);
            _.forEach(this.state.action.selectionModels, model => {
                //only care about points connecting to things
                if (!(model.model instanceof PointModel_1.PointModel)) {
                    return;
                }
                if (element && element.model instanceof PortModel_1.PortModel && !diagramEngine.isModelLocked(element.model)) {
                    let link = model.model.getLink();
                    if (link.getTargetPort() !== null) {
                        //if this was a valid link already and we are adding a node in the middle, create 2 links from the original
                        if (link.getTargetPort() !== element.model && link.getSourcePort() !== element.model) {
                            const targetPort = link.getTargetPort();
                            let newLink = link.clone({});
                            newLink.setSourcePort(element.model);
                            newLink.setTargetPort(targetPort);
                            link.setTargetPort(element.model);
                            targetPort.removeLink(link);
                            newLink.removePointsBefore(newLink.getPoints()[link.getPointIndex(model.model)]);
                            link.removePointsAfter(model.model);
                            diagramEngine.getDiagramModel().addLink(newLink);
                            //if we are connecting to the same target or source, remove tweener points
                        }
                        else if (link.getTargetPort() === element.model) {
                            link.removePointsAfter(model.model);
                        }
                        else if (link.getSourcePort() === element.model) {
                            link.removePointsBefore(model.model);
                        }
                    }
                    else {
                        link.setTargetPort(element.model);
                    }
                    delete this.props.diagramEngine.linksThatHaveInitiallyRendered[link.getID()];
                }
            });
            //check for / remove any loose links in any models which have been moved
            if (!this.props.allowLooseLinks && this.state.wasMoved) {
                _.forEach(this.state.action.selectionModels, model => {
                    //only care about points connecting to things
                    if (!(model.model instanceof PointModel_1.PointModel)) {
                        return;
                    }
                    let selectedPoint = model.model;
                    let link = selectedPoint.getLink();
                    if (link.getSourcePort() === null || link.getTargetPort() === null) {
                        link.remove();
                    }
                });
            }
            //remove any invalid links
            _.forEach(this.state.action.selectionModels, model => {
                //only care about points connecting to things
                if (!(model.model instanceof PointModel_1.PointModel)) {
                    return;
                }
                let link = model.model.getLink();
                let sourcePort = link.getSourcePort();
                let targetPort = link.getTargetPort();
                if (sourcePort !== null && targetPort !== null) {
                    if (!sourcePort.canLinkToPort(targetPort)) {
                        //link not allowed
                        link.remove();
                    }
                    else if (_.some(_.values(targetPort.getLinks()), (l) => l !== link && (l.getSourcePort() === sourcePort || l.getTargetPort() === sourcePort))) {
                        //link is a duplicate
                        link.remove();
                    }
                }
            });
            diagramEngine.clearRepaintEntities();
            this.stopFiringAction(!this.state.wasMoved);
        }
        else {
            diagramEngine.clearRepaintEntities();
            this.stopFiringAction();
        }
        this.state.document.removeEventListener("mousemove", this.onMouseMove);
        this.state.document.removeEventListener("mouseup", this.onMouseUp);
    }
    drawSelectionBox() {
        let dimensions = this.state.action.getBoxDimensions();
        return (React.createElement("div", { className: this.bem("__selector"), style: {
                top: dimensions.top,
                left: dimensions.left,
                width: dimensions.width,
                height: dimensions.height
            } }));
    }
    render() {
        var diagramEngine = this.props.diagramEngine;
        diagramEngine.setMaxNumberPointsPerLink(this.props.maxNumberPointsPerLink);
        diagramEngine.setSmartRoutingStatus(this.props.smartRouting);
        var diagramModel = diagramEngine.getDiagramModel();
        return (React.createElement("div", Object.assign({}, this.getProps(), { ref: ref => {
                if (ref) {
                    this.props.diagramEngine.setCanvas(ref);
                }
            }, onWheel: event => {
                if (this.props.allowCanvasZoom) {
                    // event.preventDefault();
                    event.stopPropagation();
                    const oldZoomFactor = diagramModel.getZoomLevel() / 100;
                    const scrollDelta = this.props.scrollSensitivity * (this.props.inverseZoom ? -event.deltaY : event.deltaY) / Math.abs(event.deltaY);
                    const currentZoom = diagramModel.getZoomLevel();
                    const newZoomLevel = currentZoom + (currentZoom * (scrollDelta / 2));
                    if ((scrollDelta < 0 && newZoomLevel > 20) || (scrollDelta > 0 && newZoomLevel < 500)) {
                        diagramModel.setZoomLevel(newZoomLevel);
                    }
                    const zoomFactor = diagramModel.getZoomLevel() / 100;
                    const boundingRect = event.currentTarget.getBoundingClientRect();
                    const clientWidth = boundingRect.width;
                    const clientHeight = boundingRect.height;
                    // compute difference between rect before and after scroll
                    const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
                    const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;
                    // compute mouse coords relative to canvas
                    const clientX = event.clientX - boundingRect.left;
                    const clientY = event.clientY - boundingRect.top;
                    // compute width and height increment factor
                    const xFactor = (clientX - diagramModel.getOffsetX()) / oldZoomFactor / clientWidth;
                    const yFactor = (clientY - diagramModel.getOffsetY()) / oldZoomFactor / clientHeight;
                    diagramModel.setOffset(diagramModel.getOffsetX() - widthDiff * xFactor, diagramModel.getOffsetY() - heightDiff * yFactor);
                    diagramEngine.enableRepaintEntities([]);
                    this.forceUpdate();
                }
            }, onMouseDown: event => {
                if (event.nativeEvent.which === 3)
                    return;
                this.setState(Object.assign({}, this.state, { wasMoved: false }));
                diagramEngine.clearRepaintEntities();
                var model = this.getMouseElement(event);
                //the canvas was selected
                if (model === null) {
                    //is it a multiple selection
                    if (event.shiftKey) {
                        var relative = diagramEngine.getRelativePoint(event.clientX, event.clientY);
                        this.startFiringAction(new SelectingAction_1.SelectingAction(relative.x, relative.y));
                    }
                    else {
                        //its a drag the canvas event
                        diagramModel.clearSelection();
                        this.startFiringAction(new MoveCanvasAction_1.MoveCanvasAction(event.clientX, event.clientY, diagramModel));
                    }
                }
                else if (model.model instanceof PortModel_1.PortModel) {
                    //its a port element, we want to drag a link
                    if (!this.props.diagramEngine.isModelLocked(model.model)) {
                        var relative = diagramEngine.getRelativeMousePoint(event);
                        var sourcePort = model.model;
                        var link = sourcePort.createLinkModel();
                        link.setSourcePort(sourcePort);
                        if (link) {
                            link.removeMiddlePoints();
                            if (link.getSourcePort() !== sourcePort) {
                                link.setSourcePort(sourcePort);
                            }
                            link.setTargetPort(null);
                            link.getFirstPoint().updateLocation(relative);
                            link.getLastPoint().updateLocation(relative);
                            diagramModel.clearSelection();
                            link.getLastPoint().setSelected(true);
                            diagramModel.addLink(link);
                            this.startFiringAction(new MoveItemsAction_1.MoveItemsAction(event.clientX, event.clientY, diagramEngine));
                        }
                    }
                    else {
                        diagramModel.clearSelection();
                    }
                }
                else {
                    //its some or other element, probably want to move it
                    if (!event.shiftKey && !model.model.isSelected()) {
                        diagramModel.clearSelection();
                    }
                    model.model.setSelected(true);
                    this.startFiringAction(new MoveItemsAction_1.MoveItemsAction(event.clientX, event.clientY, diagramEngine));
                }
                this.state.document.addEventListener("mousemove", this.onMouseMove);
                this.state.document.addEventListener("mouseup", this.onMouseUp);
            } }),
            this.state.renderedNodes && (React.createElement(LinkLayerWidget_1.LinkLayerWidget, { diagramEngine: diagramEngine, pointAdded: (point, event) => {
                    this.state.document.addEventListener("mousemove", this.onMouseMove);
                    this.state.document.addEventListener("mouseup", this.onMouseUp);
                    event.stopPropagation();
                    diagramModel.clearSelection(point);
                    this.setState({
                        action: new MoveItemsAction_1.MoveItemsAction(event.clientX, event.clientY, diagramEngine)
                    });
                } })),
            React.createElement(NodeLayerWidget_1.NodeLayerWidget, { diagramEngine: diagramEngine }),
            this.state.action instanceof SelectingAction_1.SelectingAction && this.drawSelectionBox()));
    }
}
DiagramWidget.defaultProps = {
    diagramEngine: null,
    allowLooseLinks: true,
    allowCanvasTranslation: true,
    allowCanvasZoom: true,
    inverseZoom: false,
    maxNumberPointsPerLink: Infinity,
    smartRouting: false,
    deleteKeys: [46, 8],
    scrollSensitivity: 0.2
};
exports.DiagramWidget = DiagramWidget;
//# sourceMappingURL=DiagramWidget.js.map