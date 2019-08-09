"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("./BaseModel");
const _ = require("lodash");
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
//# sourceMappingURL=NodeModel.js.map