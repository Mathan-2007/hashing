import * as crypto from "crypto";
import { SESSION_KEY } from "./cryptoSession";

/*
Decode encrypted secret token
Format expected: ENC_<IV>:<encrypted_data>
*/
export function decodeSecret(token: string): string {

    const value = token.replace("ENC_", "");

    const parts = value.split(":");

    if (parts.length !== 2) {
        throw new Error("Invalid encoded secret format");
    }

    const iv = Buffer.from(parts[0], "base64");
    const encrypted = parts[1];

    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        SESSION_KEY,
        iv
    );

    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}