"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secretMap = void 0;
exports.storeSecret = storeSecret;
exports.getOriginal = getOriginal;
exports.secretMap = {};
function storeSecret(encoded, original) {
    exports.secretMap[encoded] = original;
}
function getOriginal(encoded) {
    return exports.secretMap[encoded];
}
//# sourceMappingURL=storage.js.map