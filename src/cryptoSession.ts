import * as crypto from "crypto";

/*
Session key generated when extension loads
*/
export const SESSION_KEY = crypto.randomBytes(32);

/*
Initialization vector
*/
export const IV = crypto.randomBytes(16);