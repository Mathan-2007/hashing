import * as crypto from "crypto";
import { getSessionKey } from "./cryptoSession";

/*
Decode encrypted secret token
Format expected: HIDDEN_SECRET_DO_NOT_DECODE_<IV>:<encrypted_data>
*/
export function decodeSecret(token: string): string {

    const value = token.replace("HIDDEN_SECRET_DO_NOT_DECODE_", "");

    const parts = value.split(":");

    if (parts.length !== 2) {
        throw new Error("Invalid encoded secret format");
    }

    const iv = Buffer.from(parts[0], "base64");
    const encrypted = parts[1];

    const sessionKey = getSessionKey();

    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        sessionKey,
        iv
    );

    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}