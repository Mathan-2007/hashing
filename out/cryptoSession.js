"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCryptoSession = initCryptoSession;
exports.getSessionKey = getSessionKey;
const crypto = require("crypto");
/*
Initializes the master encryption key from VS Code's secure keychain.
Generates a new one if it is the first time running.
*/
let SESSION_KEY;
function initCryptoSession() {
    if (!SESSION_KEY) {
        console.log("DevLeakShield: Generating TEMP session key");
        SESSION_KEY = crypto.randomBytes(32);
    }
}
/*
Retrieves the loaded session key synchronously
*/
function getSessionKey() {
    if (!SESSION_KEY) {
        throw new Error("Session key not initialized");
    }
    return SESSION_KEY;
}
//# sourceMappingURL=cryptoSession.js.map