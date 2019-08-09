"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Toolkit_1 = require("./Toolkit");
const _ = require("lodash");
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
//# sourceMappingURL=BaseEntity.js.map