import * as crypto from "crypto";
import { SESSION_KEY } from "./cryptoSession";

/*
Encrypt a secret using AES-256
Returns: ENC_<IV>:<encrypted_data>
*/
export function encodeSecret(secret: string): string {

    // generate unique IV for each encryption
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        SESSION_KEY,
        iv
    );

    let encrypted = cipher.update(secret, "utf8", "base64");
    encrypted += cipher.final("base64");

    const ivString = iv.toString("base64");

    return `ENC_${ivString}:${encrypted}`;
}