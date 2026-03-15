"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSecret = encodeSecret;
const crypto = require("crypto");
const cryptoSession_1 = require("./cryptoSession");
/*
Encrypt a secret using AES-256
Returns: HIDDEN_SECRET_DO_NOT_DECODE_<IV>:<encrypted_data>
*/
function encodeSecret(secret) {
    // Use deterministic IV (md5 hash of secret produces exactly 16 bytes)
    // This guarantees the string is encrypted without random fluctuations
    const iv = crypto.createHash("md5").update(secret).digest();
    const sessionKey = (0, cryptoSession_1.getSessionKey)();
    const cipher = crypto.createCipheriv("aes-256-cbc", sessionKey, iv);
    let encrypted = cipher.update(secret, "utf8", "base64");
    encrypted += cipher.final("base64");
    const ivString = iv.toString("base64");
    return `HIDDEN_SECRET_DO_NOT_DECODE_${ivString}:${encrypted}`;
}
//# sourceMappingURL=encoder.js.map