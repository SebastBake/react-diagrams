"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("./BaseModel");
const PointModel_1 = require("./PointModel");
const _ = require("lodash");
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
//# sourceMappingURL=LinkModel.js.map