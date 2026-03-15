"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSecret = encodeSecret;
const crypto = require("crypto");
const cryptoSession_1 = require("./cryptoSession");
/*
Encrypt a secret using AES-256
Returns: ENC_<IV>:<encrypted_data>
*/
function encodeSecret(secret) {
    // generate unique IV for each encryption
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", cryptoSession_1.SESSION_KEY, iv);
    let encrypted = cipher.update(secret, "utf8", "base64");
    encrypted += cipher.final("base64");
    const ivString = iv.toString("base64");
    return `ENC_${ivString}:${encrypted}`;
}
//# sourceMappingURL=encoder.js.map