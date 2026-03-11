"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSecret = encodeSecret;
const crypto = require("crypto");
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[]<>?/";
function encodeSecret(length = 20) {
    let result = "";
    for (let i = 0; i < length; i++) {
        const index = crypto.randomInt(0, chars.length);
        result += chars[index];
    }
    return "ENC_" + result;
}
//# sourceMappingURL=encoder.js.map