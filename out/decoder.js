"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = decode;
function decode(encoded, map) {
    if (map[encoded]) {
        return map[encoded];
    }
    return encoded;
}
//# sourceMappingURL=decoder.js.map