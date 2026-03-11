import * as crypto from "crypto";
import { SESSION_KEY, IV } from "./cryptoSession";

export function decodeSecret(text: string): string {

    const value = text.replace("ENC_", "");

    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        SESSION_KEY,
        IV
    );

    let decrypted = decipher.update(value, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}