"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESSION_KEY = void 0;
const crypto = require("crypto");
exports.SESSION_KEY = crypto.randomBytes(32);
//# sourceMappingURL=cryptoSession.js.map