import * as crypto from "crypto";
import { SESSION_KEY, IV } from "./cryptoSession";

export function encodeSecret(text: string): string {

    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        SESSION_KEY,
        IV
    );

    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");

    return "ENC_" + encrypted;
}