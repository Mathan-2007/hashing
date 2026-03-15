import * as vscode from "vscode";
import * as crypto from "crypto";

let SESSION_KEY: Buffer | undefined;

/*
Initializes the master encryption key from VS Code's secure keychain.
Generates a new one if it is the first time running.
*/
export async function initCryptoSession(context: vscode.ExtensionContext) {
    let keyStr = await context.secrets.get("devLeakShield.masterKey");

    if (!keyStr) {
        console.log("DevLeakShield: Generating new persistent master key");
        const newKey = crypto.randomBytes(32);
        keyStr = newKey.toString("base64");
        await context.secrets.store("devLeakShield.masterKey", keyStr);
    }

    SESSION_KEY = Buffer.from(keyStr, "base64");
}

/*
Retrieves the loaded session key synchronously
*/
export function getSessionKey(): Buffer {
    if (!SESSION_KEY) {
        throw new Error("DevLeakShield crypto session was not initialized");
    }
    return SESSION_KEY;
}