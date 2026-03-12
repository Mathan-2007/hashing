"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeSecret = decodeSecret;
const crypto = require("crypto");
const cryptoSession_1 = require("./cryptoSession");
function decodeSecret(text) {
    const value = text.replace("ENC_", "");
    const decipher = crypto.createDecipheriv("aes-256-cbc", cryptoSession_1.SESSION_KEY, cryptoSession_1.IV);
    let decrypted = decipher.update(value, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
//# sourceMappingURL=decoder.js.map