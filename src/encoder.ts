import * as crypto from "crypto";

const chars =
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[]<>?/";

export function encodeSecret(length: number = 20): string {

    let result = "";

    for (let i = 0; i < length; i++) {
        const index = crypto.randomInt(0, chars.length);
        result += chars[index];
    }

    return "ENC_" + result;
}