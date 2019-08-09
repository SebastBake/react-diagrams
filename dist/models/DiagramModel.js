"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEntity_1 = require("../BaseEntity");
const _ = require("lodash");
const LinkModel_1 = require("./LinkModel");
const NodeModel_1 = require("./NodeModel");
const PortModel_1 = require("./PortModel");
const PointModel_1 = require("./PointModel");
/**
 *
 */
class DiagramModel extends BaseEntity_1.BaseEntity {
    constructor() {
        super();
        this.links = {};
        this.nodes = {};
        this.offsetX = 0;
        this.offsetY = 0;
        this.zoom = 100;
        this.rendered = false;
        this.gridSize = 0;
    }
    setGridSize(size = 0) {
        this.gridSize = size;
        this.iterateListeners((listener, event) => {
            if (listener.gridUpdated) {
                listener.gridUpdated(Object.assign({}, event, { size: size }));
            }
        });
    }
    getGridPosition(pos) {
        if (this.gridSize === 0) {
            return pos;
        }
        return this.gridSize * Math.floor((pos + this.gridSize / 2) / this.gridSize);
    }
    deSerializeDiagram(object, diagramEngine) {
        this.deSerialize(object, diagramEngine);
        this.offsetX = object.offsetX;
        this.offsetY = object.offsetY;
        this.zoom = object.zoom;
        this.gridSize = object.gridSize;
        // deserialize nodes
        _.forEach(object.nodes, (node) => {
            let nodeOb = diagramEngine.getNodeFactory(node.type).getNewInstance(node);
            nodeOb.setParent(this);
            nodeOb.deSerialize(node, diagramEngine);
            this.addNode(nodeOb);
        });
        // deserialze links
        _.forEach(object.links, (link) => {
            let linkOb = diagramEngine.getLinkFactory(link.type).getNewInstance();
            linkOb.setParent(this);
            linkOb.deSerialize(link, diagramEngine);
            this.addLink(linkOb);
        });
    }
    serializeDiagram() {
        return _.merge(this.serialize(), {
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            zoom: this.zoom,
            gridSize: this.gridSize,
            links: _.map(this.links, link => {
                return link.serialize();
            }),
            nodes: _.map(this.nodes, node => {
                return node.serialize();
            })
        });
    }
    clearSelection(ignore = null) {
        _.forEach(this.getSelectedItems(), element => {
            if (ignore && ignore.getID() === element.getID()) {
                return;
            }
            element.setSelected(false); //TODO dont fire the listener
        });
    }
    getSelectedItems(...filters) {
        if (!Array.isArray(filters)) {
            filters = [filters];
        }
        var items = [];
        // run through nodes
        items = items.concat(_.flatMap(this.nodes, node => {
            return node.getSelectedEntities();
        }));
        // find all the links
        items = items.concat(_.flatMap(this.links, link => {
            return link.getSelectedEntities();
        }));
        //find all points
        items = items.concat(_.flatMap(this.links, link => {
            return _.flatMap(link.points, point => {
                return point.getSelectedEntities();
            });
        }));
        items = _.uniq(items);
        if (filters.length > 0) {
            items = _.filter(_.uniq(items), (item) => {
                if (_.includes(filters, "node") && item instanceof NodeModel_1.NodeModel) {
                    return true;
                }
                if (_.includes(filters, "link") && item instanceof LinkModel_1.LinkModel) {
                    return true;
                }
                if (_.includes(filters, "port") && item instanceof PortModel_1.PortModel) {
                    return true;
                }
                if (_.includes(filters, "point") && item instanceof PointModel_1.PointModel) {
                    return true;
                }
                return false;
            });
        }
        return items;
    }
    setZoomLevel(zoom) {
        this.zoom = zoom;
        this.iterateListeners((listener, event) => {
            if (listener.zoomUpdated) {
                listener.zoomUpdated(Object.assign({}, event, { zoom: zoom }));
            }
        });
    }
    setOffset(offsetX, offsetY) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.iterateListeners((listener, event) => {
            if (listener.offsetUpdated) {
                listener.offsetUpdated(Object.assign({}, event, { offsetX: offsetX, offsetY: offsetY }));
            }
        });
    }
    setOffsetX(offsetX) {
        this.offsetX = offsetX;
        this.iterateListeners((listener, event) => {
            if (listener.offsetUpdated) {
                listener.offsetUpdated(Object.assign({}, event, { offsetX: offsetX, offsetY: this.offsetY }));
            }
        });
    }
    setOffsetY(offsetY) {
        this.offsetY = offsetY;
        this.iterateListeners((listener, event) => {
            if (listener.offsetUpdated) {
                listener.offsetUpdated(Object.assign({}, event, { offsetX: this.offsetX, offsetY: this.offsetY }));
            }
        });
    }
    getOffsetY() {
        return this.offsetY;
    }
    getOffsetX() {
        return this.offsetX;
    }
    getZoomLevel() {
        return this.zoom;
    }
    getNode(node) {
        if (node instanceof NodeModel_1.NodeModel) {
            return node;
        }
        if (!this.nodes[node]) {
            return null;
        }
        return this.nodes[node];
    }
    getLink(link) {
        if (link instanceof LinkModel_1.LinkModel) {
            return link;
        }
        if (!this.links[link]) {
            return null;
        }
        return this.links[link];
    }
    addAll(...models) {
        _.forEach(models, model => {
            if (model instanceof LinkModel_1.LinkModel) {
                this.addLink(model);
            }
            else if (model instanceof NodeModel_1.NodeModel) {
                this.addNode(model);
            }
        });
        return models;
    }
    addLink(link) {
        link.addListener({
            entityRemoved: () => {
                this.removeLink(link);
            }
        });
        this.links[link.getID()] = link;
        this.iterateListeners((listener, event) => {
            if (listener.linksUpdated) {
                listener.linksUpdated(Object.assign({}, event, { link: link, isCreated: true }));
            }
        });
        return link;
    }
    addNode(node) {
        node.addListener({
            entityRemoved: () => {
                this.removeNode(node);
            }
        });
        this.nodes[node.getID()] = node;
        this.iterateListeners((listener, event) => {
            if (listener.nodesUpdated) {
                listener.nodesUpdated(Object.assign({}, event, { node: node, isCreated: true }));
            }
        });
        return node;
    }
    removeLink(link) {
        link = this.getLink(link);
        delete this.links[link.getID()];
        this.iterateListeners((listener, event) => {
            if (listener.linksUpdated) {
                listener.linksUpdated(Object.assign({}, event, { link: link, isCreated: false }));
            }
        });
    }
    removeNode(node) {
        node = this.getNode(node);
        delete this.nodes[node.getID()];
        this.iterateListeners((listener, event) => {
            if (listener.nodesUpdated) {
                listener.nodesUpdated(Object.assign({}, event, { node: node, isCreated: false }));
            }
        });
    }
    getLinks() {
        return this.links;
    }
    getNodes() {
        return this.nodes;
    }
}
exports.DiagramModel = DiagramModel;
//# sourceMappingURL=DiagramModel.js.map