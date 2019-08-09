(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["storm-react-diagrams"] = factory();
	else
		root["storm-react-diagrams"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/BaseEntity.ts":
/*!***************************!*\
  !*** ./src/BaseEntity.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Toolkit_1 = __webpack_require__(/*! ./Toolkit */ "./src/Toolkit.ts");
const _ = __webpack_require__(/*! lodash */ "lodash");
class BaseEntity {
    constructor(id) {
        this.listeners = {};
        this.id = id || Toolkit_1.Toolkit.UID();
        this.locked = false;
    }
    getID() {
        return this.id;
    }
    doClone(lookupTable = {}, clone) {
        /*noop*/
    }
    clone(lookupTable = {}) {
        // try and use an existing clone first
        if (lookupTable[this.id]) {
            return lookupTable[this.id];
        }
        let clone = _.clone(this);
        clone.id = Toolkit_1.Toolkit.UID();
        clone.clearListeners();
        lookupTable[this.id] = clone;
        this.doClone(lookupTable, clone);
        return clone;
    }
    clearListeners() {
        this.listeners = {};
    }
    deSerialize(data, engine) {
        this.id = data.id;
    }
    serialize() {
        return {
            id: this.id
        };
    }
    iterateListeners(cb) {
        let event = {
            id: Toolkit_1.Toolkit.UID(),
            firing: true,
            entity: this,
            stopPropagation: () => {
                event.firing = false;
            }
        };
        for (var i in this.listeners) {
            if (this.listeners.hasOwnProperty(i)) {
                // propagation stopped
                if (!event.firing) {
                    return;
                }
                cb(this.listeners[i], event);
            }
        }
    }
    removeListener(listener) {
        if (this.listeners[listener]) {
            delete this.listeners[listener];
            return true;
        }
        return false;
    }
    addListener(listener) {
        var uid = Toolkit_1.Toolkit.UID();
        this.listeners[uid] = listener;
        return uid;
    }
    isLocked() {
        return this.locked;
    }
    setLocked(locked = true) {
        this.locked = locked;
        this.iterateListeners((listener, event) => {
            if (listener.lockChanged) {
                listener.lockChanged(Object.assign({}, event, { locked: locked }));
            }
        });
    }
}
exports.BaseEntity = BaseEntity;


/***/ }),

/***/ "./src/DiagramEngine.ts":
/*!******************************!*\
  !*** ./src/DiagramEngine.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseEntity_1 = __webpack_require__(/*! ./BaseEntity */ "./src/BaseEntity.ts");
const DiagramModel_1 = __webpack_require__(/*! ./models/DiagramModel */ "./src/models/DiagramModel.ts");
const _ = __webpack_require__(/*! lodash */ "lodash");
const NodeModel_1 = __webpack_require__(/*! ./models/NodeModel */ "./src/models/NodeModel.ts");
const PointModel_1 = __webpack_require__(/*! ./models/PointModel */ "./src/models/PointModel.ts");
const main_1 = __webpack_require__(/*! ./main */ "./src/main.ts");
const PathFinding_1 = __webpack_require__(/*! ./routing/PathFinding */ "./src/routing/PathFinding.ts");
const DefaultPortFactory_1 = __webpack_require__(/*! ./defaults/factories/DefaultPortFactory */ "./src/defaults/factories/DefaultPortFactory.tsx");
const DefaultLabelFactory_1 = __webpack_require__(/*! ./defaults/factories/DefaultLabelFactory */ "./src/defaults/factories/DefaultLabelFactory.tsx");
const Toolkit_1 = __webpack_require__(/*! ./Toolkit */ "./src/Toolkit.ts");
/**
 * Passed as a parameter to the DiagramWidget
 */
class DiagramEngine extends BaseEntity_1.BaseEntity {
    constructor() {
        super();
        // calculated only when smart routing is active
        this.canvasMatrix = [];
        this.routingMatrix = [];
        // used when at least one element has negative coordinates
        this.hAdjustmentFactor = 0;
        this.vAdjustmentFactor = 0;
        /**
         * Despite being a long method, we simply iterate over all three collections (nodes, ports and points)
         * to find the highest X and Y dimensions, so we can build the matrix large enough to contain all elements.
         */
        this.calculateMatrixDimensions = () => {
            const allNodesCoords = _.values(this.diagramModel.nodes).map(item => ({
                x: item.x,
                width: item.width,
                y: item.y,
                height: item.height
            }));
            const allLinks = _.values(this.diagramModel.links);
            const allPortsCoords = _.flatMap(allLinks.map(link => [link.sourcePort, link.targetPort]))
                .filter(port => port !== null)
                .map(item => ({
                x: item.x,
                width: item.width,
                y: item.y,
                height: item.height
            }));
            const allPointsCoords = _.flatMap(allLinks.map(link => link.points)).map(item => ({
                // points don't have width/height, so let's just use 0
                x: item.x,
                width: 0,
                y: item.y,
                height: 0
            }));
            const canvas = this.canvas;
            const minX = Math.floor(Math.min(_.minBy(_.concat(allNodesCoords, allPortsCoords, allPointsCoords), item => item.x).x, 0) /
                PathFinding_1.ROUTING_SCALING_FACTOR) * PathFinding_1.ROUTING_SCALING_FACTOR;
            const maxXElement = _.maxBy(_.concat(allNodesCoords, allPortsCoords, allPointsCoords), item => item.x + item.width);
            const maxX = Math.max(maxXElement.x + maxXElement.width, canvas.offsetWidth);
            const minY = Math.floor(Math.min(_.minBy(_.concat(allNodesCoords, allPortsCoords, allPointsCoords), item => item.y).y, 0) /
                PathFinding_1.ROUTING_SCALING_FACTOR) * PathFinding_1.ROUTING_SCALING_FACTOR;
            const maxYElement = _.maxBy(_.concat(allNodesCoords, allPortsCoords, allPointsCoords), item => item.y + item.height);
            const maxY = Math.max(maxYElement.y + maxYElement.height, canvas.offsetHeight);
            return {
                width: Math.ceil(Math.abs(minX) + maxX),
                hAdjustmentFactor: Math.abs(minX) / PathFinding_1.ROUTING_SCALING_FACTOR + 1,
                height: Math.ceil(Math.abs(minY) + maxY),
                vAdjustmentFactor: Math.abs(minY) / PathFinding_1.ROUTING_SCALING_FACTOR + 1
            };
        };
        /**
         * Updates (by reference) where nodes will be drawn on the matrix passed in.
         */
        this.markNodes = (matrix) => {
            _.values(this.diagramModel.nodes).forEach(node => {
                const startX = Math.floor(node.x / PathFinding_1.ROUTING_SCALING_FACTOR);
                const endX = Math.ceil((node.x + node.width) / PathFinding_1.ROUTING_SCALING_FACTOR);
                const startY = Math.floor(node.y / PathFinding_1.ROUTING_SCALING_FACTOR);
                const endY = Math.ceil((node.y + node.height) / PathFinding_1.ROUTING_SCALING_FACTOR);
                for (let x = startX - 1; x <= endX + 1; x++) {
                    for (let y = startY - 1; y < endY + 1; y++) {
                        this.markMatrixPoint(matrix, this.translateRoutingX(x), this.translateRoutingY(y));
                    }
                }
            });
        };
        /**
         * Updates (by reference) where ports will be drawn on the matrix passed in.
         */
        this.markPorts = (matrix) => {
            const allElements = _.flatMap(_.values(this.diagramModel.links).map(link => [].concat(link.sourcePort, link.targetPort)));
            allElements.filter(port => port !== null).forEach(port => {
                const startX = Math.floor(port.x / PathFinding_1.ROUTING_SCALING_FACTOR);
                const endX = Math.ceil((port.x + port.width) / PathFinding_1.ROUTING_SCALING_FACTOR);
                const startY = Math.floor(port.y / PathFinding_1.ROUTING_SCALING_FACTOR);
                const endY = Math.ceil((port.y + port.height) / PathFinding_1.ROUTING_SCALING_FACTOR);
                for (let x = startX - 1; x <= endX + 1; x++) {
                    for (let y = startY - 1; y < endY + 1; y++) {
                        this.markMatrixPoint(matrix, this.translateRoutingX(x), this.translateRoutingY(y));
                    }
                }
            });
        };
        this.markMatrixPoint = (matrix, x, y) => {
            if (matrix[y] !== undefined && matrix[y][x] !== undefined) {
                matrix[y][x] = 1;
            }
        };
        this.diagramModel = new DiagramModel_1.DiagramModel();
        this.nodeFactories = {};
        this.linkFactories = {};
        this.portFactories = {};
        this.labelFactories = {};
        this.canvas = null;
        this.paintableWidgets = null;
        this.linksThatHaveInitiallyRendered = {};
        if (Toolkit_1.Toolkit.TESTING) {
            Toolkit_1.Toolkit.TESTING_UID = 0;
            //pop it onto the window so our E2E helpers can find it
            if (window) {
                window["diagram_instance"] = this;
            }
        }
    }
    installDefaultFactories() {
        this.registerNodeFactory(new main_1.DefaultNodeFactory());
        this.registerLinkFactory(new main_1.DefaultLinkFactory());
        this.registerPortFactory(new DefaultPortFactory_1.DefaultPortFactory());
        this.registerLabelFactory(new DefaultLabelFactory_1.DefaultLabelFactory());
    }
    repaintCanvas() {
        this.iterateListeners(listener => {
            if (listener.repaintCanvas) {
                listener.repaintCanvas();
            }
        });
    }
    clearRepaintEntities() {
        this.paintableWidgets = null;
    }
    enableRepaintEntities(entities) {
        this.paintableWidgets = {};
        entities.forEach(entity => {
            //if a node is requested to repaint, add all of its links
            if (entity instanceof NodeModel_1.NodeModel) {
                _.forEach(entity.getPorts(), port => {
                    _.forEach(port.getLinks(), link => {
                        this.paintableWidgets[link.getID()] = true;
                    });
                });
            }
            if (entity instanceof PointModel_1.PointModel) {
                this.paintableWidgets[entity.getLink().getID()] = true;
            }
            this.paintableWidgets[entity.getID()] = true;
        });
    }
    /**
     * Checks to see if a model is locked by running through
     * its parents to see if they are locked first
     */
    isModelLocked(model) {
        //always check the diagram model
        if (this.diagramModel.isLocked()) {
            return true;
        }
        return model.isLocked();
    }
    recalculatePortsVisually() {
        this.nodesRendered = false;
        this.linksThatHaveInitiallyRendered = {};
    }
    canEntityRepaint(baseModel) {
        //no rules applied, allow repaint
        if (this.paintableWidgets === null) {
            return true;
        }
        return this.paintableWidgets[baseModel.getID()] !== undefined;
    }
    setCanvas(canvas) {
        this.canvas = canvas;
    }
    setDiagramModel(model) {
        this.diagramModel = model;
        this.recalculatePortsVisually();
    }
    getDiagramModel() {
        return this.diagramModel;
    }
    //!-------------- FACTORIES ------------
    getNodeFactories() {
        return this.nodeFactories;
    }
    getLinkFactories() {
        return this.linkFactories;
    }
    getLabelFactories() {
        return this.labelFactories;
    }
    registerLabelFactory(factory) {
        this.labelFactories[factory.getType()] = factory;
        this.iterateListeners(listener => {
            if (listener.labelFactoriesUpdated) {
                listener.labelFactoriesUpdated();
            }
        });
    }
    registerPortFactory(factory) {
        this.portFactories[factory.getType()] = factory;
        this.iterateListeners(listener => {
            if (listener.portFactoriesUpdated) {
                listener.portFactoriesUpdated();
            }
        });
    }
    registerNodeFactory(factory) {
        this.nodeFactories[factory.getType()] = factory;
        this.iterateListeners(listener => {
            if (listener.nodeFactoriesUpdated) {
                listener.nodeFactoriesUpdated();
            }
        });
    }
    registerLinkFactory(factory) {
        this.linkFactories[factory.getType()] = factory;
        this.iterateListeners(listener => {
            if (listener.linkFactoriesUpdated) {
                listener.linkFactoriesUpdated();
            }
        });
    }
    getPortFactory(type) {
        if (this.portFactories[type]) {
            return this.portFactories[type];
        }
        throw new Error(`cannot find factory for port of type: [${type}]`);
    }
    getNodeFactory(type) {
        if (this.nodeFactories[type]) {
            return this.nodeFactories[type];
        }
        throw new Error(`cannot find factory for node of type: [${type}]`);
    }
    getLinkFactory(type) {
        if (this.linkFactories[type]) {
            return this.linkFactories[type];
        }
        throw new Error(`cannot find factory for link of type: [${type}]`);
    }
    getLabelFactory(type) {
        if (this.labelFactories[type]) {
            return this.labelFactories[type];
        }
        throw new Error(`cannot find factory for label of type: [${type}]`);
    }
    getFactoryForNode(node) {
        return this.getNodeFactory(node.getType());
    }
    getFactoryForLink(link) {
        return this.getLinkFactory(link.getType());
    }
    getFactoryForLabel(label) {
        return this.getLabelFactory(label.getType());
    }
    generateWidgetForLink(link) {
        var linkFactory = this.getFactoryForLink(link);
        if (!linkFactory) {
            throw new Error("Cannot find link factory for link: " + link.getType());
        }
        return linkFactory.generateReactWidget(this, link);
    }
    generateWidgetForNode(node) {
        var nodeFactory = this.getFactoryForNode(node);
        if (!nodeFactory) {
            throw new Error("Cannot find widget factory for node: " + node.getType());
        }
        return nodeFactory.generateReactWidget(this, node);
    }
    getRelativeMousePoint(event) {
        var point = this.getRelativePoint(event.clientX, event.clientY);
        return {
            x: (point.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100.0),
            y: (point.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100.0)
        };
    }
    getRelativePoint(x, y) {
        var canvasRect = this.canvas.getBoundingClientRect();
        return { x: x - canvasRect.left, y: y - canvasRect.top };
    }
    getNodeElement(node) {
        const selector = this.canvas.querySelector(`.node[data-nodeid="${node.getID()}"]`);
        if (selector === null) {
            throw new Error("Cannot find Node element with nodeID: [" + node.getID() + "]");
        }
        return selector;
    }
    getNodePortElement(port) {
        var selector = this.canvas.querySelector(`.port[data-name="${port.getName()}"][data-nodeid="${port.getParent().getID()}"]`);
        if (selector === null) {
            throw new Error("Cannot find Node Port element with nodeID: [" +
                port.getParent().getID() +
                "] and name: [" +
                port.getName() +
                "]");
        }
        return selector;
    }
    getPortCenter(port) {
        var sourceElement = this.getNodePortElement(port);
        var sourceRect = sourceElement.getBoundingClientRect();
        var rel = this.getRelativePoint(sourceRect.left, sourceRect.top);
        return {
            x: sourceElement.offsetWidth / 2 +
                (rel.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100.0),
            y: sourceElement.offsetHeight / 2 +
                (rel.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100.0)
        };
    }
    /**
     * Calculate rectangular coordinates of the port passed in.
     */
    getPortCoords(port) {
        const sourceElement = this.getNodePortElement(port);
        const sourceRect = sourceElement.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();
        return {
            x: (sourceRect.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100.0) -
                canvasRect.left,
            y: (sourceRect.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100.0) -
                canvasRect.top,
            width: sourceRect.width,
            height: sourceRect.height
        };
    }
    /**
     * Determine the width and height of the node passed in.
     * It currently assumes nodes have a rectangular shape, can be overriden for customised shapes.
     */
    getNodeDimensions(node) {
        if (!this.canvas) {
            return {
                width: 0,
                height: 0
            };
        }
        const nodeElement = this.getNodeElement(node);
        const nodeRect = nodeElement.getBoundingClientRect();
        return {
            width: nodeRect.width,
            height: nodeRect.height
        };
    }
    getMaxNumberPointsPerLink() {
        return this.maxNumberPointsPerLink;
    }
    setMaxNumberPointsPerLink(max) {
        this.maxNumberPointsPerLink = max;
    }
    isSmartRoutingEnabled() {
        return !!this.smartRouting;
    }
    setSmartRoutingStatus(status) {
        this.smartRouting = status;
    }
    /**
     * A representation of the canvas in the following format:
     *
     * +-----------------+
     * | 0 0 0 0 0 0 0 0 |
     * | 0 0 0 0 0 0 0 0 |
     * | 0 0 0 0 0 0 0 0 |
     * | 0 0 0 0 0 0 0 0 |
     * | 0 0 0 0 0 0 0 0 |
     * +-----------------+
     *
     * In which all walkable points are marked by zeros.
     * It uses @link{#ROUTING_SCALING_FACTOR} to reduce the matrix dimensions and improve performance.
     */
    getCanvasMatrix() {
        if (this.canvasMatrix.length === 0) {
            this.calculateCanvasMatrix();
        }
        return this.canvasMatrix;
    }
    calculateCanvasMatrix() {
        const { width: canvasWidth, hAdjustmentFactor, height: canvasHeight, vAdjustmentFactor } = this.calculateMatrixDimensions();
        this.hAdjustmentFactor = hAdjustmentFactor;
        this.vAdjustmentFactor = vAdjustmentFactor;
        const matrixWidth = Math.ceil(canvasWidth / PathFinding_1.ROUTING_SCALING_FACTOR);
        const matrixHeight = Math.ceil(canvasHeight / PathFinding_1.ROUTING_SCALING_FACTOR);
        this.canvasMatrix = _.range(0, matrixHeight).map(() => {
            return new Array(matrixWidth).fill(0);
        });
    }
    /**
     * A representation of the canvas in the following format:
     *
     * +-----------------+
     * | 0 0 1 1 0 0 0 0 |
     * | 0 0 1 1 0 0 1 1 |
     * | 0 0 0 0 0 0 1 1 |
     * | 1 1 0 0 0 0 0 0 |
     * | 1 1 0 0 0 0 0 0 |
     * +-----------------+
     *
     * In which all points blocked by a node (and its ports) are
     * marked as 1; points were there is nothing (ie, free) receive 0.
     */
    getRoutingMatrix() {
        if (this.routingMatrix.length === 0) {
            this.calculateRoutingMatrix();
        }
        return this.routingMatrix;
    }
    calculateRoutingMatrix() {
        const matrix = _.cloneDeep(this.getCanvasMatrix());
        // nodes need to be marked as blocked points
        this.markNodes(matrix);
        // same thing for ports
        this.markPorts(matrix);
        this.routingMatrix = matrix;
    }
    /**
     * The routing matrix does not have negative indexes, but elements could be negatively positioned.
     * We use the functions below to translate back and forth between these coordinates, relying on the
     * calculated values of hAdjustmentFactor and vAdjustmentFactor.
     */
    translateRoutingX(x, reverse = false) {
        return x + this.hAdjustmentFactor * (reverse ? -1 : 1);
    }
    translateRoutingY(y, reverse = false) {
        return y + this.vAdjustmentFactor * (reverse ? -1 : 1);
    }
    zoomToFit() {
        const xFactor = this.canvas.clientWidth / this.canvas.scrollWidth;
        const yFactor = this.canvas.clientHeight / this.canvas.scrollHeight;
        const zoomFactor = xFactor < yFactor ? xFactor : yFactor;
        this.diagramModel.setZoomLevel(this.diagramModel.getZoomLevel() * zoomFactor);
        this.diagramModel.setOffset(0, 0);
        this.repaintCanvas();
    }
}
exports.DiagramEngine = DiagramEngine;


/***/ }),

/***/ "./src/Toolkit.ts":
/*!************************!*\
  !*** ./src/Toolkit.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable no-bitwise
const closest = __webpack_require__(/*! closest */ "closest");
const PathFinding_1 = __webpack_require__(/*! ./routing/PathFinding */ "./src/routing/PathFinding.ts");
const Path = __webpack_require__(/*! paths-js/path */ "paths-js/path");
/**
 * @author Dylan Vorster
 */
class Toolkit {
    /**
     * Generats a unique ID (thanks Stack overflow :3)
     * @returns {String}
     */
    static UID() {
        if (Toolkit.TESTING) {
            Toolkit.TESTING_UID++;
            return "" + Toolkit.TESTING_UID;
        }
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    /**
     * Finds the closest element as a polyfill
     *
     * @param  {Element} element  [description]
     * @param  {string}  selector [description]
     */
    static closest(element, selector) {
        if (document.body.closest) {
            return element.closest(selector);
        }
        return closest(element, selector);
    }
    static generateLinePath(firstPoint, lastPoint) {
        return `M${firstPoint.x},${firstPoint.y} L ${lastPoint.x},${lastPoint.y}`;
    }
    static generateCurvePath(firstPoint, lastPoint, curvy = 0) {
        var isHorizontal = Math.abs(firstPoint.x - lastPoint.x) > Math.abs(firstPoint.y - lastPoint.y);
        var xOrY = isHorizontal ? "x" : "y";
        // make sure that smoothening works
        // without disrupting the line direction
        let curvyness = curvy;
        if (firstPoint[xOrY] > firstPoint[xOrY]) {
            curvyness = -curvy;
        }
        var curvyX = isHorizontal ? curvyness : 0;
        var curvyY = isHorizontal ? 0 : curvyness;
        return `M${firstPoint.x},${firstPoint.y} C ${firstPoint.x + curvyX},${firstPoint.y + curvyY}
    ${lastPoint.x - curvyX},${lastPoint.y - curvyY} ${lastPoint.x},${lastPoint.y}`;
    }
    static generateDynamicPath(pathCoords) {
        let path = Path();
        path = path.moveto(pathCoords[0][0] * PathFinding_1.ROUTING_SCALING_FACTOR, pathCoords[0][1] * PathFinding_1.ROUTING_SCALING_FACTOR);
        pathCoords.slice(1).forEach(coords => {
            path = path.lineto(coords[0] * PathFinding_1.ROUTING_SCALING_FACTOR, coords[1] * PathFinding_1.ROUTING_SCALING_FACTOR);
        });
        return path.print();
    }
}
Toolkit.TESTING = false;
Toolkit.TESTING_UID = 0;
exports.Toolkit = Toolkit;


/***/ }),

/***/ "./src/actions/BaseAction.ts":
/*!***********************************!*\
  !*** ./src/actions/BaseAction.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class BaseAction {
    constructor(mouseX, mouseY) {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
        this.ms = new Date().getTime();
    }
}
exports.BaseAction = BaseAction;


/***/ }),

/***/ "./src/actions/MoveCanvasAction.ts":
/*!*****************************************!*\
  !*** ./src/actions/MoveCanvasAction.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseAction_1 = __webpack_require__(/*! ./BaseAction */ "./src/actions/BaseAction.ts");
class MoveCanvasAction extends BaseAction_1.BaseAction {
    constructor(mouseX, mouseY, diagramModel) {
        super(mouseX, mouseY);
        this.initialOffsetX = diagramModel.getOffsetX();
        this.initialOffsetY = diagramModel.getOffsetY();
    }
}
exports.MoveCanvasAction = MoveCanvasAction;


/***/ }),

/***/ "./src/actions/MoveItemsAction.ts":
/*!****************************************!*\
  !*** ./src/actions/MoveItemsAction.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseAction_1 = __webpack_require__(/*! ./BaseAction */ "./src/actions/BaseAction.ts");
class MoveItemsAction extends BaseAction_1.BaseAction {
    constructor(mouseX, mouseY, diagramEngine) {
        super(mouseX, mouseY);
        this.moved = false;
        diagramEngine.enableRepaintEntities(diagramEngine.getDiagramModel().getSelectedItems());
        var selectedItems = diagramEngine.getDiagramModel().getSelectedItems();
        //dont allow items which are locked to move
        selectedItems = selectedItems.filter(item => {
            return !diagramEngine.isModelLocked(item);
        });
        this.selectionModels = selectedItems.map((item) => {
            return {
                model: item,
                initialX: item.x,
                initialY: item.y
            };
        });
    }
}
exports.MoveItemsAction = MoveItemsAction;


/***/ }),

/***/ "./src/actions/SelectingAction.ts":
/*!****************************************!*\
  !*** ./src/actions/SelectingAction.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseAction_1 = __webpack_require__(/*! ./BaseAction */ "./src/actions/BaseAction.ts");
class SelectingAction extends BaseAction_1.BaseAction {
    constructor(mouseX, mouseY) {
        super(mouseX, mouseY);
        this.mouseX2 = mouseX;
        this.mouseY2 = mouseY;
    }
    getBoxDimensions() {
        return {
            left: this.mouseX2 > this.mouseX ? this.mouseX : this.mouseX2,
            top: this.mouseY2 > this.mouseY ? this.mouseY : this.mouseY2,
            width: Math.abs(this.mouseX2 - this.mouseX),
            height: Math.abs(this.mouseY2 - this.mouseY),
            right: this.mouseX2 < this.mouseX ? this.mouseX : this.mouseX2,
            bottom: this.mouseY2 < this.mouseY ? this.mouseY : this.mouseY2
        };
    }
    containsElement(x, y, diagramModel) {
        var z = diagramModel.getZoomLevel() / 100.0;
        let dimensions = this.getBoxDimensions();
        return (x * z + diagramModel.getOffsetX() > dimensions.left &&
            x * z + diagramModel.getOffsetX() < dimensions.right &&
            y * z + diagramModel.getOffsetY() > dimensions.top &&
            y * z + diagramModel.getOffsetY() < dimensions.bottom);
    }
}
exports.SelectingAction = SelectingAction;


/***/ }),

/***/ "./src/defaults/factories/DefaultLabelFactory.tsx":
/*!********************************************************!*\
  !*** ./src/defaults/factories/DefaultLabelFactory.tsx ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const AbstractLabelFactory_1 = __webpack_require__(/*! ../../factories/AbstractLabelFactory */ "./src/factories/AbstractLabelFactory.ts");
const DefaultLabelModel_1 = __webpack_require__(/*! ../models/DefaultLabelModel */ "./src/defaults/models/DefaultLabelModel.tsx");
const DefaultLabelWidget_1 = __webpack_require__(/*! ../widgets/DefaultLabelWidget */ "./src/defaults/widgets/DefaultLabelWidget.tsx");
/**
 * @author Dylan Vorster
 */
class DefaultLabelFactory extends AbstractLabelFactory_1.AbstractLabelFactory {
    constructor() {
        super("default");
    }
    generateReactWidget(diagramEngine, label) {
        return React.createElement(DefaultLabelWidget_1.DefaultLabelWidget, { model: label });
    }
    getNewInstance(initialConfig) {
        return new DefaultLabelModel_1.DefaultLabelModel();
    }
}
exports.DefaultLabelFactory = DefaultLabelFactory;


/***/ }),

/***/ "./src/defaults/factories/DefaultLinkFactory.tsx":
/*!*******************************************************!*\
  !*** ./src/defaults/factories/DefaultLinkFactory.tsx ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const DefaultLinkWidget_1 = __webpack_require__(/*! ../widgets/DefaultLinkWidget */ "./src/defaults/widgets/DefaultLinkWidget.tsx");
const AbstractLinkFactory_1 = __webpack_require__(/*! ../../factories/AbstractLinkFactory */ "./src/factories/AbstractLinkFactory.ts");
const DefaultLinkModel_1 = __webpack_require__(/*! ../models/DefaultLinkModel */ "./src/defaults/models/DefaultLinkModel.ts");
/**
 * @author Dylan Vorster
 */
class DefaultLinkFactory extends AbstractLinkFactory_1.AbstractLinkFactory {
    constructor() {
        super("default");
    }
    generateReactWidget(diagramEngine, link) {
        return React.createElement(DefaultLinkWidget_1.DefaultLinkWidget, {
            link: link,
            diagramEngine: diagramEngine
        });
    }
    getNewInstance(initialConfig) {
        return new DefaultLinkModel_1.DefaultLinkModel();
    }
    generateLinkSegment(model, widget, selected, path) {
        return (React.createElement("path", { className: selected ? widget.bem("--path-selected") : "", strokeWidth: model.width, stroke: model.color, d: path }));
    }
}
exports.DefaultLinkFactory = DefaultLinkFactory;


/***/ }),

/***/ "./src/defaults/factories/DefaultNodeFactory.ts":
/*!******************************************************!*\
  !*** ./src/defaults/factories/DefaultNodeFactory.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const DefaultNodeModel_1 = __webpack_require__(/*! ../models/DefaultNodeModel */ "./src/defaults/models/DefaultNodeModel.ts");
const React = __webpack_require__(/*! react */ "react");
const DefaultNodeWidget_1 = __webpack_require__(/*! ../widgets/DefaultNodeWidget */ "./src/defaults/widgets/DefaultNodeWidget.tsx");
const AbstractNodeFactory_1 = __webpack_require__(/*! ../../factories/AbstractNodeFactory */ "./src/factories/AbstractNodeFactory.ts");
/**
 * @author Dylan Vorster
 */
class DefaultNodeFactory extends AbstractNodeFactory_1.AbstractNodeFactory {
    constructor() {
        super("default");
    }
    generateReactWidget(diagramEngine, node) {
        return React.createElement(DefaultNodeWidget_1.DefaultNodeWidget, {
            node: node,
            diagramEngine: diagramEngine
        });
    }
    getNewInstance(initialConfig) {
        return new DefaultNodeModel_1.DefaultNodeModel();
    }
}
exports.DefaultNodeFactory = DefaultNodeFactory;


/***/ }),

/***/ "./src/defaults/factories/DefaultPortFactory.tsx":
/*!*******************************************************!*\
  !*** ./src/defaults/factories/DefaultPortFactory.tsx ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const DefaultPortModel_1 = __webpack_require__(/*! ../models/DefaultPortModel */ "./src/defaults/models/DefaultPortModel.ts");
const AbstractPortFactory_1 = __webpack_require__(/*! ../../factories/AbstractPortFactory */ "./src/factories/AbstractPortFactory.ts");
class DefaultPortFactory extends AbstractPortFactory_1.AbstractPortFactory {
    constructor() {
        super("default");
    }
    getNewInstance(initialConfig) {
        return new DefaultPortModel_1.DefaultPortModel(true, "unknown");
    }
}
exports.DefaultPortFactory = DefaultPortFactory;


/***/ }),

/***/ "./src/defaults/models/DefaultLabelModel.tsx":
/*!***************************************************!*\
  !*** ./src/defaults/models/DefaultLabelModel.tsx ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const LabelModel_1 = __webpack_require__(/*! ../../models/LabelModel */ "./src/models/LabelModel.ts");
const _ = __webpack_require__(/*! lodash */ "lodash");
class DefaultLabelModel extends LabelModel_1.LabelModel {
    constructor() {
        super("default");
        this.offsetY = -23;
    }
    setLabel(label) {
        this.label = label;
    }
    deSerialize(ob, engine) {
        super.deSerialize(ob, engine);
        this.label = ob.label;
    }
    serialize() {
        return _.merge(super.serialize(), {
            label: this.label
        });
    }
}
exports.DefaultLabelModel = DefaultLabelModel;


/***/ }),

/***/ "./src/defaults/models/DefaultLinkModel.ts":
/*!*************************************************!*\
  !*** ./src/defaults/models/DefaultLinkModel.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Dylan Vorster
 */
const LinkModel_1 = __webpack_require__(/*! ../../models/LinkModel */ "./src/models/LinkModel.ts");
const _ = __webpack_require__(/*! lodash */ "lodash");
const DefaultLabelModel_1 = __webpack_require__(/*! ./DefaultLabelModel */ "./src/defaults/models/DefaultLabelModel.tsx");
const LabelModel_1 = __webpack_require__(/*! ../../models/LabelModel */ "./src/models/LabelModel.ts");
class DefaultLinkModel extends LinkModel_1.LinkModel {
    constructor(type = "default") {
        super(type);
        this.color = "rgba(255,255,255,0.5)";
        this.width = 3;
        this.curvyness = 50;
    }
    serialize() {
        return _.merge(super.serialize(), {
            width: this.width,
            color: this.color,
            curvyness: this.curvyness
        });
    }
    deSerialize(ob, engine) {
        super.deSerialize(ob, engine);
        this.color = ob.color;
        this.width = ob.width;
        this.curvyness = ob.curvyness;
    }
    addLabel(label) {
        if (label instanceof LabelModel_1.LabelModel) {
            return super.addLabel(label);
        }
        let labelOb = new DefaultLabelModel_1.DefaultLabelModel();
        labelOb.setLabel(label);
        return super.addLabel(labelOb);
    }
    setWidth(width) {
        this.width = width;
        this.iterateListeners((listener, event) => {
            if (listener.widthChanged) {
                listener.widthChanged(Object.assign({}, event, { width: width }));
            }
        });
    }
    setColor(color) {
        this.color = color;
        this.iterateListeners((listener, event) => {
            if (listener.colorChanged) {
                listener.colorChanged(Object.assign({}, event, { color: color }));
            }
        });
    }
}
exports.DefaultLinkModel = DefaultLinkModel;


/***/ }),

/***/ "./src/defaults/models/DefaultNodeModel.ts":
/*!*************************************************!*\
  !*** ./src/defaults/models/DefaultNodeModel.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const DefaultPortModel_1 = __webpack_require__(/*! ./DefaultPortModel */ "./src/defaults/models/DefaultPortModel.ts");
const _ = __webpack_require__(/*! lodash */ "lodash");
const NodeModel_1 = __webpack_require__(/*! ../../models/NodeModel */ "./src/models/NodeModel.ts");
const Toolkit_1 = __webpack_require__(/*! ../../Toolkit */ "./src/Toolkit.ts");
/**
 * @author Dylan Vorster
 */
class DefaultNodeModel extends NodeModel_1.NodeModel {
    constructor(name = "Untitled", color = "rgb(0,192,255)") {
        super("default");
        this.name = name;
        this.color = color;
    }
    addInPort(label) {
        return this.addPort(new DefaultPortModel_1.DefaultPortModel(true, Toolkit_1.Toolkit.UID(), label));
    }
    addOutPort(label) {
        return this.addPort(new DefaultPortModel_1.DefaultPortModel(false, Toolkit_1.Toolkit.UID(), label));
    }
    deSerialize(object, engine) {
        super.deSerialize(object, engine);
        this.name = object.name;
        this.color = object.color;
    }
    serialize() {
        return _.merge(super.serialize(), {
            name: this.name,
            color: this.color
        });
    }
    getInPorts() {
        return _.filter(this.ports, portModel => {
            return portModel.in;
        });
    }
    getOutPorts() {
        return _.filter(this.ports, portModel => {
            return !portModel.in;
        });
    }
}
exports.DefaultNodeModel = DefaultNodeModel;


/***/ }),

/***/ "./src/defaults/models/DefaultPortModel.ts":
/*!*************************************************!*\
  !*** ./src/defaults/models/DefaultPortModel.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const _ = __webpack_require__(/*! lodash */ "lodash");
const PortModel_1 = __webpack_require__(/*! ../../models/PortModel */ "./src/models/PortModel.ts");
const DefaultLinkModel_1 = __webpack_require__(/*! ./DefaultLinkModel */ "./src/defaults/models/DefaultLinkModel.ts");
class DefaultPortModel extends PortModel_1.PortModel {
    constructor(isInput, name, label = null, id) {
        super(name, "default", id);
        this.in = isInput;
        this.label = label || name;
    }
    deSerialize(object, engine) {
        super.deSerialize(object, engine);
        this.in = object.in;
        this.label = object.label;
    }
    serialize() {
        return _.merge(super.serialize(), {
            in: this.in,
            label: this.label
        });
    }
    link(port) {
        let link = this.createLinkModel();
        link.setSourcePort(this);
        link.setTargetPort(port);
        return link;
    }
    canLinkToPort(port) {
        if (port instanceof DefaultPortModel) {
            return this.in !== port.in;
        }
        return true;
    }
    createLinkModel() {
        let link = super.createLinkModel();
        return link || new DefaultLinkModel_1.DefaultLinkModel();
    }
}
exports.DefaultPortModel = DefaultPortModel;


/***/ }),

/***/ "./src/defaults/widgets/DefaultLabelWidget.tsx":
/*!*****************************************************!*\
  !*** ./src/defaults/widgets/DefaultLabelWidget.tsx ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const BaseWidget_1 = __webpack_require__(/*! ../../widgets/BaseWidget */ "./src/widgets/BaseWidget.tsx");
class DefaultLabelWidget extends BaseWidget_1.BaseWidget {
    constructor(props) {
        super("srd-default-label", props);
    }
    render() {
        return React.createElement("div", Object.assign({}, this.getProps()), this.props.model.label);
    }
}
exports.DefaultLabelWidget = DefaultLabelWidget;


/***/ }),

/***/ "./src/defaults/widgets/DefaultLinkWidget.tsx":
/*!****************************************************!*\
  !*** ./src/defaults/widgets/DefaultLinkWidget.tsx ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const PointModel_1 = __webpack_require__(/*! ../../models/PointModel */ "./src/models/PointModel.ts");
const Toolkit_1 = __webpack_require__(/*! ../../Toolkit */ "./src/Toolkit.ts");
const PathFinding_1 = __webpack_require__(/*! ../../routing/PathFinding */ "./src/routing/PathFinding.ts");
const _ = __webpack_require__(/*! lodash */ "lodash");
const BaseWidget_1 = __webpack_require__(/*! ../../widgets/BaseWidget */ "./src/widgets/BaseWidget.tsx");
class DefaultLinkWidget extends BaseWidget_1.BaseWidget {
    constructor(props) {
        super("srd-default-link", props);
        this.addPointToLink = (event, index) => {
            if (!event.shiftKey &&
                !this.props.diagramEngine.isModelLocked(this.props.link) &&
                this.props.link.points.length - 1 <= this.props.diagramEngine.getMaxNumberPointsPerLink()) {
                const point = new PointModel_1.PointModel(this.props.link, this.props.diagramEngine.getRelativeMousePoint(event));
                point.setSelected(true);
                this.forceUpdate();
                this.props.link.addPoint(point, index);
                this.props.pointAdded(point, event);
            }
        };
        this.findPathAndRelativePositionToRenderLabel = (index) => {
            // an array to hold all path lengths, making sure we hit the DOM only once to fetch this information
            const lengths = this.refPaths.map(path => path.getTotalLength());
            // calculate the point where we want to display the label
            let labelPosition = lengths.reduce((previousValue, currentValue) => previousValue + currentValue, 0) *
                (index / (this.props.link.labels.length + 1));
            // find the path where the label will be rendered and calculate the relative position
            let pathIndex = 0;
            while (pathIndex < this.refPaths.length) {
                if (labelPosition - lengths[pathIndex] < 0) {
                    return {
                        path: this.refPaths[pathIndex],
                        position: labelPosition
                    };
                }
                // keep searching
                labelPosition -= lengths[pathIndex];
                pathIndex++;
            }
        };
        this.calculateLabelPosition = (label, index) => {
            if (!this.refLabels[label.id]) {
                // no label? nothing to do here
                return;
            }
            const { path, position } = this.findPathAndRelativePositionToRenderLabel(index);
            const labelDimensions = {
                width: this.refLabels[label.id].offsetWidth,
                height: this.refLabels[label.id].offsetHeight
            };
            const pathCentre = path.getPointAtLength(position);
            const labelCoordinates = {
                x: pathCentre.x - labelDimensions.width / 2 + label.offsetX,
                y: pathCentre.y - labelDimensions.height / 2 + label.offsetY
            };
            this.refLabels[label.id].setAttribute("style", `transform: translate(${labelCoordinates.x}px, ${labelCoordinates.y}px);`);
        };
        this.refLabels = {};
        this.refPaths = [];
        this.state = {
            selected: false
        };
        if (props.diagramEngine.isSmartRoutingEnabled()) {
            this.pathFinding = new PathFinding_1.default(this.props.diagramEngine);
        }
    }
    calculateAllLabelPosition() {
        _.forEach(this.props.link.labels, (label, index) => {
            this.calculateLabelPosition(label, index + 1);
        });
    }
    componentDidUpdate() {
        if (this.props.link.labels.length > 0) {
            window.requestAnimationFrame(this.calculateAllLabelPosition.bind(this));
        }
    }
    componentDidMount() {
        if (this.props.link.labels.length > 0) {
            window.requestAnimationFrame(this.calculateAllLabelPosition.bind(this));
        }
    }
    generatePoint(pointIndex) {
        let x = this.props.link.points[pointIndex].x;
        let y = this.props.link.points[pointIndex].y;
        return (React.createElement("g", { key: "point-" + this.props.link.points[pointIndex].id },
            React.createElement("circle", { cx: x, cy: y, r: 5, className: "point " +
                    this.bem("__point") +
                    (this.props.link.points[pointIndex].isSelected() ? this.bem("--point-selected") : "") }),
            React.createElement("circle", { onMouseLeave: () => {
                    this.setState({ selected: false });
                }, onMouseEnter: () => {
                    this.setState({ selected: true });
                }, "data-id": this.props.link.points[pointIndex].id, "data-linkid": this.props.link.id, cx: x, cy: y, r: 15, opacity: 0, className: "point " + this.bem("__point") })));
    }
    generateLabel(label) {
        const canvas = this.props.diagramEngine.canvas;
        return (React.createElement("foreignObject", { key: label.id, className: this.bem("__label"), width: canvas.offsetWidth, height: canvas.offsetHeight },
            React.createElement("div", { ref: ref => (this.refLabels[label.id] = ref) }, this.props.diagramEngine
                .getFactoryForLabel(label)
                .generateReactWidget(this.props.diagramEngine, label))));
    }
    generateLink(path, extraProps, id) {
        var props = this.props;
        var Bottom = React.cloneElement(props.diagramEngine.getFactoryForLink(this.props.link).generateLinkSegment(this.props.link, this, this.state.selected || this.props.link.isSelected(), path), {
            ref: ref => ref && this.refPaths.push(ref)
        });
        var Top = React.cloneElement(Bottom, Object.assign({}, extraProps, { strokeLinecap: "round", onMouseLeave: () => {
                this.setState({ selected: false });
            }, onMouseEnter: () => {
                this.setState({ selected: true });
            }, ref: null, "data-linkid": this.props.link.getID(), strokeOpacity: this.state.selected ? 0.1 : 0, strokeWidth: 20, onContextMenu: () => {
                if (!this.props.diagramEngine.isModelLocked(this.props.link)) {
                    event.preventDefault();
                    this.props.link.remove();
                }
            } }));
        return (React.createElement("g", { key: "link-" + id },
            Bottom,
            Top));
    }
    /**
     * Smart routing is only applicable when all conditions below are true:
     * - smart routing is set to true on the engine
     * - current link is between two nodes (not between a node and an empty point)
     * - no custom points exist along the line
     */
    isSmartRoutingApplicable() {
        const { diagramEngine, link } = this.props;
        if (!diagramEngine.isSmartRoutingEnabled()) {
            return false;
        }
        if (link.points.length !== 2) {
            return false;
        }
        if (link.sourcePort === null || link.targetPort === null) {
            return false;
        }
        return true;
    }
    render() {
        const { diagramEngine } = this.props;
        if (!diagramEngine.nodesRendered) {
            return null;
        }
        //ensure id is present for all points on the path
        var points = this.props.link.points;
        var paths = [];
        if (this.isSmartRoutingApplicable()) {
            // first step: calculate a direct path between the points being linked
            const directPathCoords = this.pathFinding.calculateDirectPath(_.first(points), _.last(points));
            const routingMatrix = diagramEngine.getRoutingMatrix();
            // now we need to extract, from the routing matrix, the very first walkable points
            // so they can be used as origin and destination of the link to be created
            const smartLink = this.pathFinding.calculateLinkStartEndCoords(routingMatrix, directPathCoords);
            if (smartLink) {
                const { start, end, pathToStart, pathToEnd } = smartLink;
                // second step: calculate a path avoiding hitting other elements
                const simplifiedPath = this.pathFinding.calculateDynamicPath(routingMatrix, start, end, pathToStart, pathToEnd);
                paths.push(
                //smooth: boolean, extraProps: any, id: string | number, firstPoint: PointModel, lastPoint: PointModel
                this.generateLink(Toolkit_1.Toolkit.generateDynamicPath(simplifiedPath), {
                    onMouseDown: event => {
                        this.addPointToLink(event, 1);
                    }
                }, "0"));
            }
        }
        // true when smart routing was skipped or not enabled.
        // See @link{#isSmartRoutingApplicable()}.
        if (paths.length === 0) {
            if (points.length === 2) {
                var isHorizontal = Math.abs(points[0].x - points[1].x) > Math.abs(points[0].y - points[1].y);
                var xOrY = isHorizontal ? "x" : "y";
                //draw the smoothing
                //if the points are too close, just draw a straight line
                var margin = 50;
                if (Math.abs(points[0][xOrY] - points[1][xOrY]) < 50) {
                    margin = 5;
                }
                var pointLeft = points[0];
                var pointRight = points[1];
                paths.push(this.generateLink(Toolkit_1.Toolkit.generateCurvePath(pointLeft, pointRight, this.props.link.curvyness), {
                    onMouseDown: event => {
                        this.addPointToLink(event, 1);
                    }
                }, "0"));
                // draw the link as dangeling
                if (this.props.link.targetPort === null) {
                    paths.push(this.generatePoint(1));
                }
            }
            else {
                //draw the multiple anchors and complex line instead
                for (let j = 0; j < points.length - 1; j++) {
                    paths.push(this.generateLink(Toolkit_1.Toolkit.generateLinePath(points[j], points[j + 1]), {
                        "data-linkid": this.props.link.id,
                        "data-point": j,
                        onMouseDown: (event) => {
                            this.addPointToLink(event, j + 1);
                        }
                    }, j));
                }
                //render the circles
                for (var i = 1; i < points.length - 1; i++) {
                    paths.push(this.generatePoint(i));
                }
                if (this.props.link.targetPort === null) {
                    paths.push(this.generatePoint(points.length - 1));
                }
            }
        }
        this.refPaths = [];
        return (React.createElement("g", Object.assign({}, this.getProps()),
            paths,
            _.map(this.props.link.labels, labelModel => {
                return this.generateLabel(labelModel);
            })));
    }
}
DefaultLinkWidget.defaultProps = {
    color: "black",
    width: 3,
    link: null,
    engine: null,
    smooth: false,
    diagramEngine: null
};
exports.DefaultLinkWidget = DefaultLinkWidget;


/***/ }),

/***/ "./src/defaults/widgets/DefaultNodeWidget.tsx":
/*!****************************************************!*\
  !*** ./src/defaults/widgets/DefaultNodeWidget.tsx ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const _ = __webpack_require__(/*! lodash */ "lodash");
const DefaultPortLabelWidget_1 = __webpack_require__(/*! ./DefaultPortLabelWidget */ "./src/defaults/widgets/DefaultPortLabelWidget.tsx");
const BaseWidget_1 = __webpack_require__(/*! ../../widgets/BaseWidget */ "./src/widgets/BaseWidget.tsx");
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


/***/ }),

/***/ "./src/defaults/widgets/DefaultPortLabelWidget.tsx":
/*!*********************************************************!*\
  !*** ./src/defaults/widgets/DefaultPortLabelWidget.tsx ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const PortWidget_1 = __webpack_require__(/*! ../../widgets/PortWidget */ "./src/widgets/PortWidget.tsx");
const BaseWidget_1 = __webpack_require__(/*! ../../widgets/BaseWidget */ "./src/widgets/BaseWidget.tsx");
/**
 * @author Dylan Vorster
 */
class DefaultPortLabel extends BaseWidget_1.BaseWidget {
    constructor(props) {
        super("srd-default-port", props);
    }
    getClassName() {
        return super.getClassName() + (this.props.model.in ? this.bem("--in") : this.bem("--out"));
    }
    render() {
        var port = React.createElement(PortWidget_1.PortWidget, { node: this.props.model.getParent(), name: this.props.model.name });
        var label = React.createElement("div", { className: "name" }, this.props.model.label);
        return (React.createElement("div", Object.assign({}, this.getProps()),
            this.props.model.in ? port : label,
            this.props.model.in ? label : port));
    }
}
exports.DefaultPortLabel = DefaultPortLabel;


/***/ }),

/***/ "./src/factories/AbstractFactory.ts":
/*!******************************************!*\
  !*** ./src/factories/AbstractFactory.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class AbstractFactory {
    constructor(name) {
        this.type = name;
    }
    getType() {
        return this.type;
    }
}
exports.AbstractFactory = AbstractFactory;


/***/ }),

/***/ "./src/factories/AbstractLabelFactory.ts":
/*!***********************************************!*\
  !*** ./src/factories/AbstractLabelFactory.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AbstractFactory_1 = __webpack_require__(/*! ./AbstractFactory */ "./src/factories/AbstractFactory.ts");
class AbstractLabelFactory extends AbstractFactory_1.AbstractFactory {
}
exports.AbstractLabelFactory = AbstractLabelFactory;


/***/ }),

/***/ "./src/factories/AbstractLinkFactory.ts":
/*!**********************************************!*\
  !*** ./src/factories/AbstractLinkFactory.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AbstractFactory_1 = __webpack_require__(/*! ./AbstractFactory */ "./src/factories/AbstractFactory.ts");
class AbstractLinkFactory extends AbstractFactory_1.AbstractFactory {
}
exports.AbstractLinkFactory = AbstractLinkFactory;


/***/ }),

/***/ "./src/factories/AbstractNodeFactory.ts":
/*!**********************************************!*\
  !*** ./src/factories/AbstractNodeFactory.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AbstractFactory_1 = __webpack_require__(/*! ./AbstractFactory */ "./src/factories/AbstractFactory.ts");
class AbstractNodeFactory extends AbstractFactory_1.AbstractFactory {
}
exports.AbstractNodeFactory = AbstractNodeFactory;


/***/ }),

/***/ "./src/factories/AbstractPortFactory.ts":
/*!**********************************************!*\
  !*** ./src/factories/AbstractPortFactory.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AbstractFactory_1 = __webpack_require__(/*! ./AbstractFactory */ "./src/factories/AbstractFactory.ts");
class AbstractPortFactory extends AbstractFactory_1.AbstractFactory {
}
exports.AbstractPortFactory = AbstractPortFactory;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @author Dylan Vorster
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./Toolkit */ "./src/Toolkit.ts"));
__export(__webpack_require__(/*! ./BaseEntity */ "./src/BaseEntity.ts"));
__export(__webpack_require__(/*! ./DiagramEngine */ "./src/DiagramEngine.ts"));
__export(__webpack_require__(/*! ./defaults/models/DefaultNodeModel */ "./src/defaults/models/DefaultNodeModel.ts"));
__export(__webpack_require__(/*! ./defaults/models/DefaultPortModel */ "./src/defaults/models/DefaultPortModel.ts"));
__export(__webpack_require__(/*! ./defaults/models/DefaultLinkModel */ "./src/defaults/models/DefaultLinkModel.ts"));
__export(__webpack_require__(/*! ./defaults/models/DefaultLabelModel */ "./src/defaults/models/DefaultLabelModel.tsx"));
__export(__webpack_require__(/*! ./defaults/factories/DefaultLinkFactory */ "./src/defaults/factories/DefaultLinkFactory.tsx"));
__export(__webpack_require__(/*! ./defaults/factories/DefaultNodeFactory */ "./src/defaults/factories/DefaultNodeFactory.ts"));
__export(__webpack_require__(/*! ./defaults/factories/DefaultPortFactory */ "./src/defaults/factories/DefaultPortFactory.tsx"));
__export(__webpack_require__(/*! ./defaults/factories/DefaultLabelFactory */ "./src/defaults/factories/DefaultLabelFactory.tsx"));
__export(__webpack_require__(/*! ./defaults/widgets/DefaultLinkWidget */ "./src/defaults/widgets/DefaultLinkWidget.tsx"));
__export(__webpack_require__(/*! ./defaults/widgets/DefaultLabelWidget */ "./src/defaults/widgets/DefaultLabelWidget.tsx"));
__export(__webpack_require__(/*! ./defaults/widgets/DefaultNodeWidget */ "./src/defaults/widgets/DefaultNodeWidget.tsx"));
__export(__webpack_require__(/*! ./defaults/widgets/DefaultPortLabelWidget */ "./src/defaults/widgets/DefaultPortLabelWidget.tsx"));
__export(__webpack_require__(/*! ./factories/AbstractFactory */ "./src/factories/AbstractFactory.ts"));
__export(__webpack_require__(/*! ./factories/AbstractLabelFactory */ "./src/factories/AbstractLabelFactory.ts"));
__export(__webpack_require__(/*! ./factories/AbstractLinkFactory */ "./src/factories/AbstractLinkFactory.ts"));
__export(__webpack_require__(/*! ./factories/AbstractNodeFactory */ "./src/factories/AbstractNodeFactory.ts"));
__export(__webpack_require__(/*! ./factories/AbstractPortFactory */ "./src/factories/AbstractPortFactory.ts"));
__export(__webpack_require__(/*! ./routing/PathFinding */ "./src/routing/PathFinding.ts"));
__export(__webpack_require__(/*! ./actions/BaseAction */ "./src/actions/BaseAction.ts"));
__export(__webpack_require__(/*! ./actions/MoveCanvasAction */ "./src/actions/MoveCanvasAction.ts"));
__export(__webpack_require__(/*! ./actions/MoveItemsAction */ "./src/actions/MoveItemsAction.ts"));
__export(__webpack_require__(/*! ./actions/SelectingAction */ "./src/actions/SelectingAction.ts"));
__export(__webpack_require__(/*! ./models/BaseModel */ "./src/models/BaseModel.ts"));
__export(__webpack_require__(/*! ./models/DiagramModel */ "./src/models/DiagramModel.ts"));
__export(__webpack_require__(/*! ./models/LinkModel */ "./src/models/LinkModel.ts"));
__export(__webpack_require__(/*! ./models/NodeModel */ "./src/models/NodeModel.ts"));
__export(__webpack_require__(/*! ./models/PointModel */ "./src/models/PointModel.ts"));
__export(__webpack_require__(/*! ./models/PortModel */ "./src/models/PortModel.ts"));
__export(__webpack_require__(/*! ./models/LabelModel */ "./src/models/LabelModel.ts"));
__export(__webpack_require__(/*! ./widgets/DiagramWidget */ "./src/widgets/DiagramWidget.tsx"));
__export(__webpack_require__(/*! ./widgets/LinkWidget */ "./src/widgets/LinkWidget.tsx"));
__export(__webpack_require__(/*! ./widgets/NodeWidget */ "./src/widgets/NodeWidget.tsx"));
__export(__webpack_require__(/*! ./widgets/PortWidget */ "./src/widgets/PortWidget.tsx"));
__export(__webpack_require__(/*! ./widgets/BaseWidget */ "./src/widgets/BaseWidget.tsx"));
__export(__webpack_require__(/*! ./widgets/layers/LinkLayerWidget */ "./src/widgets/layers/LinkLayerWidget.tsx"));
__export(__webpack_require__(/*! ./widgets/layers/NodeLayerWidget */ "./src/widgets/layers/NodeLayerWidget.tsx"));


/***/ }),

/***/ "./src/models/BaseModel.ts":
/*!*********************************!*\
  !*** ./src/models/BaseModel.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseEntity_1 = __webpack_require__(/*! ../BaseEntity */ "./src/BaseEntity.ts");
const _ = __webpack_require__(/*! lodash */ "lodash");
/**
 * @author Dylan Vorster
 */
class BaseModel extends BaseEntity_1.BaseEntity {
    constructor(type, id) {
        super(id);
        this.type = type;
        this.selected = false;
    }
    getParent() {
        return this.parent;
    }
    setParent(parent) {
        this.parent = parent;
    }
    getSelectedEntities() {
        if (this.isSelected()) {
            return [this];
        }
        return [];
    }
    deSerialize(ob, engine) {
        super.deSerialize(ob, engine);
        this.type = ob.type;
        this.selected = ob.selected;
    }
    serialize() {
        return _.merge(super.serialize(), {
            type: this.type,
            selected: this.selected
        });
    }
    getType() {
        return this.type;
    }
    getID() {
        return this.id;
    }
    isSelected() {
        return this.selected;
    }
    setSelected(selected = true) {
        this.selected = selected;
        this.iterateListeners((listener, event) => {
            if (listener.selectionChanged) {
                listener.selectionChanged(Object.assign({}, event, { isSelected: selected }));
            }
        });
    }
    remove() {
        this.iterateListeners((listener, event) => {
            if (listener.entityRemoved) {
                listener.entityRemoved(event);
            }
        });
    }
}
exports.BaseModel = BaseModel;


/***/ }),

/***/ "./src/models/DiagramModel.ts":
/*!************************************!*\
  !*** ./src/models/DiagramModel.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseEntity_1 = __webpack_require__(/*! ../BaseEntity */ "./src/BaseEntity.ts");
const _ = __webpack_require__(/*! lodash */ "lodash");
const LinkModel_1 = __webpack_require__(/*! ./LinkModel */ "./src/models/LinkModel.ts");
const NodeModel_1 = __webpack_require__(/*! ./NodeModel */ "./src/models/NodeModel.ts");
const PortModel_1 = __webpack_require__(/*! ./PortModel */ "./src/models/PortModel.ts");
const PointModel_1 = __webpack_require__(/*! ./PointModel */ "./src/models/PointModel.ts");
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


/***/ }),

/***/ "./src/models/LabelModel.ts":
/*!**********************************!*\
  !*** ./src/models/LabelModel.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = __webpack_require__(/*! ./BaseModel */ "./src/models/BaseModel.ts");
const _ = __webpack_require__(/*! lodash */ "lodash");
class LabelModel extends BaseModel_1.BaseModel {
    constructor(type, id) {
        super(type, id);
        this.offsetX = 0;
        this.offsetY = 0;
    }
    deSerialize(ob, engine) {
        super.deSerialize(ob, engine);
        this.offsetX = ob.offsetX;
        this.offsetY = ob.offsetY;
    }
    serialize() {
        return _.merge(super.serialize(), {
            offsetX: this.offsetX,
            offsetY: this.offsetY
        });
    }
}
exports.LabelModel = LabelModel;


/***/ }),

/***/ "./src/models/LinkModel.ts":
/*!*********************************!*\
  !*** ./src/models/LinkModel.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = __webpack_require__(/*! ./BaseModel */ "./src/models/BaseModel.ts");
const PointModel_1 = __webpack_require__(/*! ./PointModel */ "./src/models/PointModel.ts");
const _ = __webpack_require__(/*! lodash */ "lodash");
class LinkModel extends BaseModel_1.BaseModel {
    constructor(linkType = "default", id) {
        super(linkType, id);
        this.points = [new PointModel_1.PointModel(this, { x: 0, y: 0 }), new PointModel_1.PointModel(this, { x: 0, y: 0 })];
        this.extras = {};
        this.sourcePort = null;
        this.targetPort = null;
        this.labels = [];
    }
    deSerialize(ob, engine) {
        super.deSerialize(ob, engine);
        this.extras = ob.extras;
        this.points = _.map(ob.points || [], (point) => {
            var p = new PointModel_1.PointModel(this, { x: point.x, y: point.y });
            p.deSerialize(point, engine);
            return p;
        });
        //deserialize labels
        _.forEach(ob.labels || [], (label) => {
            let labelOb = engine.getLabelFactory(label.type).getNewInstance();
            labelOb.deSerialize(label, engine);
            this.addLabel(labelOb);
        });
        if (ob.target) {
            this.setTargetPort(this.getParent()
                .getNode(ob.target)
                .getPortFromID(ob.targetPort));
        }
        if (ob.source) {
            this.setSourcePort(this.getParent()
                .getNode(ob.source)
                .getPortFromID(ob.sourcePort));
        }
    }
    serialize() {
        return _.merge(super.serialize(), {
            source: this.sourcePort ? this.sourcePort.getParent().id : null,
            sourcePort: this.sourcePort ? this.sourcePort.id : null,
            target: this.targetPort ? this.targetPort.getParent().id : null,
            targetPort: this.targetPort ? this.targetPort.id : null,
            points: _.map(this.points, point => {
                return point.serialize();
            }),
            extras: this.extras,
            labels: _.map(this.labels, label => {
                return label.serialize();
            })
        });
    }
    doClone(lookupTable = {}, clone) {
        clone.setPoints(_.map(this.getPoints(), (point) => {
            return point.clone(lookupTable);
        }));
        if (this.sourcePort) {
            clone.setSourcePort(this.sourcePort.clone(lookupTable));
        }
        if (this.targetPort) {
            clone.setTargetPort(this.targetPort.clone(lookupTable));
        }
    }
    remove() {
        if (this.sourcePort) {
            this.sourcePort.removeLink(this);
        }
        if (this.targetPort) {
            this.targetPort.removeLink(this);
        }
        super.remove();
    }
    isLastPoint(point) {
        var index = this.getPointIndex(point);
        return index === this.points.length - 1;
    }
    getPointIndex(point) {
        return this.points.indexOf(point);
    }
    getPointModel(id) {
        for (var i = 0; i < this.points.length; i++) {
            if (this.points[i].id === id) {
                return this.points[i];
            }
        }
        return null;
    }
    getPortForPoint(point) {
        if (this.sourcePort !== null && this.getFirstPoint().getID() === point.getID()) {
            return this.sourcePort;
        }
        if (this.targetPort !== null && this.getLastPoint().getID() === point.getID()) {
            return this.targetPort;
        }
        return null;
    }
    getPointForPort(port) {
        if (this.sourcePort !== null && this.sourcePort.getID() === port.getID()) {
            return this.getFirstPoint();
        }
        if (this.targetPort !== null && this.targetPort.getID() === port.getID()) {
            return this.getLastPoint();
        }
        return null;
    }
    getFirstPoint() {
        return this.points[0];
    }
    getLastPoint() {
        return this.points[this.points.length - 1];
    }
    setSourcePort(port) {
        if (port !== null) {
            port.addLink(this);
        }
        if (this.sourcePort !== null) {
            this.sourcePort.removeLink(this);
        }
        this.sourcePort = port;
        this.iterateListeners((listener, event) => {
            if (listener.sourcePortChanged) {
                listener.sourcePortChanged(Object.assign({}, event, { port: port }));
            }
        });
    }
    getSourcePort() {
        return this.sourcePort;
    }
    getTargetPort() {
        return this.targetPort;
    }
    setTargetPort(port) {
        if (port !== null) {
            port.addLink(this);
        }
        if (this.targetPort !== null) {
            this.targetPort.removeLink(this);
        }
        this.targetPort = port;
        this.iterateListeners((listener, event) => {
            if (listener.targetPortChanged) {
                listener.targetPortChanged(Object.assign({}, event, { port: port }));
            }
        });
    }
    point(x, y) {
        return this.addPoint(this.generatePoint(x, y));
    }
    addLabel(label) {
        label.setParent(this);
        this.labels.push(label);
    }
    getPoints() {
        return this.points;
    }
    setPoints(points) {
        _.forEach(points, point => {
            point.setParent(this);
        });
        this.points = points;
    }
    removePoint(pointModel) {
        this.points.splice(this.getPointIndex(pointModel), 1);
    }
    removePointsBefore(pointModel) {
        this.points.splice(0, this.getPointIndex(pointModel));
    }
    removePointsAfter(pointModel) {
        this.points.splice(this.getPointIndex(pointModel) + 1);
    }
    removeMiddlePoints() {
        if (this.points.length > 2) {
            this.points.splice(0, this.points.length - 2);
        }
    }
    addPoint(pointModel, index = 1) {
        pointModel.setParent(this);
        this.points.splice(index, 0, pointModel);
        return pointModel;
    }
    generatePoint(x = 0, y = 0) {
        return new PointModel_1.PointModel(this, { x: x, y: y });
    }
}
exports.LinkModel = LinkModel;


/***/ }),

/***/ "./src/models/NodeModel.ts":
/*!*********************************!*\
  !*** ./src/models/NodeModel.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = __webpack_require__(/*! ./BaseModel */ "./src/models/BaseModel.ts");
const _ = __webpack_require__(/*! lodash */ "lodash");
class NodeModel extends BaseModel_1.BaseModel {
    constructor(nodeType = "default", id) {
        super(nodeType, id);
        this.x = 0;
        this.y = 0;
        this.extras = {};
        this.ports = {};
    }
    setPosition(x, y) {
        //store position
        let oldX = this.x;
        let oldY = this.y;
        _.forEach(this.ports, port => {
            _.forEach(port.getLinks(), link => {
                let point = link.getPointForPort(port);
                point.x = point.x + x - oldX;
                point.y = point.y + y - oldY;
            });
        });
        this.x = x;
        this.y = y;
    }
    positionChanged() {
        this.iterateListeners((listener, event) => listener.positionChanged && listener.positionChanged(event));
    }
    getSelectedEntities() {
        let entities = super.getSelectedEntities();
        // add the points of each link that are selected here
        if (this.isSelected()) {
            _.forEach(this.ports, port => {
                entities = entities.concat(_.map(port.getLinks(), link => {
                    return link.getPointForPort(port);
                }));
            });
        }
        return entities;
    }
    deSerialize(ob, engine) {
        super.deSerialize(ob, engine);
        this.x = ob.x;
        this.y = ob.y;
        this.extras = ob.extras;
        //deserialize ports
        _.forEach(ob.ports, (port) => {
            let portOb = engine.getPortFactory(port.type).getNewInstance();
            portOb.deSerialize(port, engine);
            this.addPort(portOb);
        });
    }
    serialize() {
        return _.merge(super.serialize(), {
            x: this.x,
            y: this.y,
            extras: this.extras,
            ports: _.map(this.ports, port => {
                return port.serialize();
            })
        });
    }
    doClone(lookupTable = {}, clone) {
        // also clone the ports
        clone.ports = {};
        _.forEach(this.ports, port => {
            clone.addPort(port.clone(lookupTable));
        });
    }
    remove() {
        super.remove();
        _.forEach(this.ports, port => {
            _.forEach(port.getLinks(), link => {
                link.remove();
            });
        });
    }
    getPortFromID(id) {
        for (var i in this.ports) {
            if (this.ports[i].id === id) {
                return this.ports[i];
            }
        }
        return null;
    }
    getPort(name) {
        return this.ports[name];
    }
    getPorts() {
        return this.ports;
    }
    removePort(port) {
        //clear the parent node reference
        if (this.ports[port.name]) {
            this.ports[port.name].setParent(null);
            delete this.ports[port.name];
        }
    }
    addPort(port) {
        port.setParent(this);
        this.ports[port.name] = port;
        return port;
    }
    updateDimensions({ width, height }) {
        this.width = width;
        this.height = height;
    }
}
exports.NodeModel = NodeModel;


/***/ }),

/***/ "./src/models/PointModel.ts":
/*!**********************************!*\
  !*** ./src/models/PointModel.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = __webpack_require__(/*! ./BaseModel */ "./src/models/BaseModel.ts");
const _ = __webpack_require__(/*! lodash */ "lodash");
class PointModel extends BaseModel_1.BaseModel {
    constructor(link, points) {
        super();
        this.x = points.x;
        this.y = points.y;
        this.parent = link;
    }
    getSelectedEntities() {
        if (super.isSelected() && !this.isConnectedToPort()) {
            return [this];
        }
        return [];
    }
    isConnectedToPort() {
        return this.parent.getPortForPoint(this) !== null;
    }
    getLink() {
        return this.getParent();
    }
    deSerialize(ob, engine) {
        super.deSerialize(ob, engine);
        this.x = ob.x;
        this.y = ob.y;
    }
    serialize() {
        return _.merge(super.serialize(), {
            x: this.x,
            y: this.y
        });
    }
    remove() {
        //clear references
        if (this.parent) {
            this.parent.removePoint(this);
        }
        super.remove();
    }
    updateLocation(points) {
        this.x = points.x;
        this.y = points.y;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    isLocked() {
        return super.isLocked() || this.getParent().isLocked();
    }
}
exports.PointModel = PointModel;


/***/ }),

/***/ "./src/models/PortModel.ts":
/*!*********************************!*\
  !*** ./src/models/PortModel.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = __webpack_require__(/*! ./BaseModel */ "./src/models/BaseModel.ts");
const _ = __webpack_require__(/*! lodash */ "lodash");
class PortModel extends BaseModel_1.BaseModel {
    constructor(name, type, id, maximumLinks) {
        super(type, id);
        this.name = name;
        this.links = {};
        this.maximumLinks = maximumLinks;
    }
    deSerialize(ob, engine) {
        super.deSerialize(ob, engine);
        this.name = ob.name;
        this.maximumLinks = ob.maximumLinks;
    }
    serialize() {
        return _.merge(super.serialize(), {
            name: this.name,
            parentNode: this.parent.id,
            links: _.map(this.links, link => {
                return link.id;
            }),
            maximumLinks: this.maximumLinks
        });
    }
    doClone(lookupTable = {}, clone) {
        clone.links = {};
        clone.parentNode = this.getParent().clone(lookupTable);
    }
    getNode() {
        return this.getParent();
    }
    getName() {
        return this.name;
    }
    getMaximumLinks() {
        return this.maximumLinks;
    }
    setMaximumLinks(maximumLinks) {
        this.maximumLinks = maximumLinks;
    }
    removeLink(link) {
        delete this.links[link.getID()];
    }
    addLink(link) {
        this.links[link.getID()] = link;
    }
    getLinks() {
        return this.links;
    }
    createLinkModel() {
        if (_.isFinite(this.maximumLinks)) {
            var numberOfLinks = _.size(this.links);
            if (this.maximumLinks === 1 && numberOfLinks >= 1) {
                return _.values(this.links)[0];
            }
            else if (numberOfLinks >= this.maximumLinks) {
                return null;
            }
        }
        return null;
    }
    updateCoords({ x, y, width, height }) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    canLinkToPort(port) {
        return true;
    }
    isLocked() {
        return super.isLocked() || this.getParent().isLocked();
    }
}
exports.PortModel = PortModel;


/***/ }),

/***/ "./src/routing/PathFinding.ts":
/*!************************************!*\
  !*** ./src/routing/PathFinding.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const PF = __webpack_require__(/*! pathfinding */ "pathfinding");
/*
it can be very expensive to calculate routes when every single pixel on the canvas
is individually represented. Using the factor below, we combine values in order
to achieve the best trade-off between accuracy and performance.
*/
exports.ROUTING_SCALING_FACTOR = 5;
const pathFinderInstance = new PF.JumpPointFinder({
    heuristic: PF.Heuristic.manhattan,
    diagonalMovement: PF.DiagonalMovement.Never
});
class PathFinding {
    constructor(diagramEngine) {
        this.instance = pathFinderInstance;
        this.diagramEngine = diagramEngine;
    }
    /**
     * Taking as argument a fully unblocked walking matrix, this method
     * finds a direct path from point A to B.
     */
    calculateDirectPath(from, to) {
        const matrix = this.diagramEngine.getCanvasMatrix();
        const grid = new PF.Grid(matrix);
        return pathFinderInstance.findPath(this.diagramEngine.translateRoutingX(Math.floor(from.x / exports.ROUTING_SCALING_FACTOR)), this.diagramEngine.translateRoutingY(Math.floor(from.y / exports.ROUTING_SCALING_FACTOR)), this.diagramEngine.translateRoutingX(Math.floor(to.x / exports.ROUTING_SCALING_FACTOR)), this.diagramEngine.translateRoutingY(Math.floor(to.y / exports.ROUTING_SCALING_FACTOR)), grid);
    }
    /**
     * Using @link{#calculateDirectPath}'s result as input, we here
     * determine the first walkable point found in the matrix that includes
     * blocked paths.
     */
    calculateLinkStartEndCoords(matrix, path) {
        const startIndex = path.findIndex(point => matrix[point[1]][point[0]] === 0);
        const endIndex = path.length -
            1 -
            path
                .slice()
                .reverse()
                .findIndex(point => matrix[point[1]][point[0]] === 0);
        // are we trying to create a path exclusively through blocked areas?
        // if so, let's fallback to the linear routing
        if (startIndex === -1 || endIndex === -1) {
            return undefined;
        }
        const pathToStart = path.slice(0, startIndex);
        const pathToEnd = path.slice(endIndex);
        return {
            start: {
                x: path[startIndex][0],
                y: path[startIndex][1]
            },
            end: {
                x: path[endIndex][0],
                y: path[endIndex][1]
            },
            pathToStart,
            pathToEnd
        };
    }
    /**
     * Puts everything together: merges the paths from/to the centre of the ports,
     * with the path calculated around other elements.
     */
    calculateDynamicPath(routingMatrix, start, end, pathToStart, pathToEnd) {
        // generate the path based on the matrix with obstacles
        const grid = new PF.Grid(routingMatrix);
        const dynamicPath = pathFinderInstance.findPath(start.x, start.y, end.x, end.y, grid);
        // aggregate everything to have the calculated path ready for rendering
        const pathCoords = pathToStart
            .concat(dynamicPath, pathToEnd)
            .map(coords => [
            this.diagramEngine.translateRoutingX(coords[0], true),
            this.diagramEngine.translateRoutingY(coords[1], true)
        ]);
        return PF.Util.compressPath(pathCoords);
    }
}
exports.default = PathFinding;


/***/ }),

/***/ "./src/widgets/BaseWidget.tsx":
/*!************************************!*\
  !*** ./src/widgets/BaseWidget.tsx ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
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


/***/ }),

/***/ "./src/widgets/DiagramWidget.tsx":
/*!***************************************!*\
  !*** ./src/widgets/DiagramWidget.tsx ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const _ = __webpack_require__(/*! lodash */ "lodash");
const LinkLayerWidget_1 = __webpack_require__(/*! ./layers/LinkLayerWidget */ "./src/widgets/layers/LinkLayerWidget.tsx");
const NodeLayerWidget_1 = __webpack_require__(/*! ./layers/NodeLayerWidget */ "./src/widgets/layers/NodeLayerWidget.tsx");
const Toolkit_1 = __webpack_require__(/*! ../Toolkit */ "./src/Toolkit.ts");
const MoveCanvasAction_1 = __webpack_require__(/*! ../actions/MoveCanvasAction */ "./src/actions/MoveCanvasAction.ts");
const MoveItemsAction_1 = __webpack_require__(/*! ../actions/MoveItemsAction */ "./src/actions/MoveItemsAction.ts");
const SelectingAction_1 = __webpack_require__(/*! ../actions/SelectingAction */ "./src/actions/SelectingAction.ts");
const NodeModel_1 = __webpack_require__(/*! ../models/NodeModel */ "./src/models/NodeModel.ts");
const PointModel_1 = __webpack_require__(/*! ../models/PointModel */ "./src/models/PointModel.ts");
const PortModel_1 = __webpack_require__(/*! ../models/PortModel */ "./src/models/PortModel.ts");
const BaseWidget_1 = __webpack_require__(/*! ./BaseWidget */ "./src/widgets/BaseWidget.tsx");
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
        if (true) {
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
                    let scrollDelta = this.props.scrollSensitivity * (this.props.inverseZoom ? -event.deltaY : event.deltaY) / Math.abs(event.deltaY);
                    const newZoomLevel = diagramModel.getZoomLevel() + (diagramModel.getZoomLevel() / 2 * (scrollDelta));
                    if (newZoomLevel > 20) {
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


/***/ }),

/***/ "./src/widgets/LinkWidget.tsx":
/*!************************************!*\
  !*** ./src/widgets/LinkWidget.tsx ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseWidget_1 = __webpack_require__(/*! ./BaseWidget */ "./src/widgets/BaseWidget.tsx");
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


/***/ }),

/***/ "./src/widgets/NodeWidget.tsx":
/*!************************************!*\
  !*** ./src/widgets/NodeWidget.tsx ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const BaseWidget_1 = __webpack_require__(/*! ./BaseWidget */ "./src/widgets/BaseWidget.tsx");
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


/***/ }),

/***/ "./src/widgets/PortWidget.tsx":
/*!************************************!*\
  !*** ./src/widgets/PortWidget.tsx ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const BaseWidget_1 = __webpack_require__(/*! ./BaseWidget */ "./src/widgets/BaseWidget.tsx");
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


/***/ }),

/***/ "./src/widgets/layers/LinkLayerWidget.tsx":
/*!************************************************!*\
  !*** ./src/widgets/layers/LinkLayerWidget.tsx ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const LinkWidget_1 = __webpack_require__(/*! ../LinkWidget */ "./src/widgets/LinkWidget.tsx");
const _ = __webpack_require__(/*! lodash */ "lodash");
const BaseWidget_1 = __webpack_require__(/*! ../BaseWidget */ "./src/widgets/BaseWidget.tsx");
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


/***/ }),

/***/ "./src/widgets/layers/NodeLayerWidget.tsx":
/*!************************************************!*\
  !*** ./src/widgets/layers/NodeLayerWidget.tsx ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const _ = __webpack_require__(/*! lodash */ "lodash");
const NodeWidget_1 = __webpack_require__(/*! ../NodeWidget */ "./src/widgets/NodeWidget.tsx");
const BaseWidget_1 = __webpack_require__(/*! ../BaseWidget */ "./src/widgets/BaseWidget.tsx");
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


/***/ }),

/***/ "closest":
/*!**************************!*\
  !*** external "closest" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("closest");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "pathfinding":
/*!******************************!*\
  !*** external "pathfinding" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("pathfinding");

/***/ }),

/***/ "paths-js/path":
/*!********************************!*\
  !*** external "paths-js/path" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("paths-js/path");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ })

/******/ });
});
//# sourceMappingURL=main.js.map