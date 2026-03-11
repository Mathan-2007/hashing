"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSecret = encodeSecret;
const crypto = require("crypto");
const cryptoSession_1 = require("./cryptoSession");
function encodeSecret(text) {
    const cipher = crypto.createCipheriv("aes-256-cbc", cryptoSession_1.SESSION_KEY, cryptoSession_1.IV);
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return "ENC_" + encrypted;
}
//# sourceMappingURL=encoder.js.map