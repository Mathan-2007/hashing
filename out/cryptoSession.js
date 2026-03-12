"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IV = exports.SESSION_KEY = void 0;
const crypto = require("crypto");
/*
Session key generated when extension loads
*/
exports.SESSION_KEY = crypto.randomBytes(32);
/*
Initialization vector
*/
exports.IV = crypto.randomBytes(16);
//# sourceMappingURL=cryptoSession.js.map