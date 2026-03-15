"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCryptoSession = initCryptoSession;
exports.getSessionKey = getSessionKey;
const crypto = require("crypto");
let SESSION_KEY;
/*
Initializes the master encryption key from VS Code's secure keychain.
Generates a new one if it is the first time running.
*/
async function initCryptoSession(context) {
    let keyStr = await context.secrets.get("devLeakShield.masterKey");
    if (!keyStr) {
        console.log("DevLeakShield: Generating new persistent master key");
        const newKey = crypto.randomBytes(32);
        keyStr = newKey.toString("base64");
        await context.secrets.store("devLeakShield.masterKey", keyStr);
    }
    SESSION_KEY = Buffer.from(keyStr, "base64");
}
/*
Retrieves the loaded session key synchronously
*/
function getSessionKey() {
    if (!SESSION_KEY) {
        throw new Error("DevLeakShield crypto session was not initialized");
    }
    return SESSION_KEY;
}
//# sourceMappingURL=cryptoSession.js.map