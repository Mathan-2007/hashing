"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeSecret = decodeSecret;
const crypto = require("crypto");
const cryptoSession_1 = require("./cryptoSession");
/*
Decode encrypted secret token
Format expected: ENC_<IV>:<encrypted_data>
*/
function decodeSecret(token) {
    const value = token.replace("ENC_", "");
    const parts = value.split(":");
    if (parts.length !== 2) {
        throw new Error("Invalid encoded secret format");
    }
    const iv = Buffer.from(parts[0], "base64");
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv("aes-256-cbc", cryptoSession_1.SESSION_KEY, iv);
    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
//# sourceMappingURL=decoder.js.map