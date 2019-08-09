"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable no-bitwise
const closest = require("closest");
const PathFinding_1 = require("./routing/PathFinding");
const Path = require("paths-js/path");
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
//# sourceMappingURL=Toolkit.js.map