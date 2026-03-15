import * as vscode from "vscode";
import { maskEditorSecrets, restoreEditorSecrets } from "./editorMasker";
import { secureCopy, securePaste } from "./clipboardGuard";

import { initCryptoSession } from "./cryptoSession";
import { lockWorkspace, unlockWorkspace } from "./workspaceLocker";

/*
Prevent infinite masking loops
*/
let masking = false;

export async function activate(context: vscode.ExtensionContext) {

    // Initialize Persistent Memory Crypto Key
    await initCryptoSession(context);

    console.log("DevLeakShield activated");

    /*
    SECURE COPY COMMAND
    */
    context.subscriptions.push(
        vscode.commands.registerCommand("devLeakShield.secureCopy", async () => {
            await secureCopy();
        })
    );

    /*
    SECURE PASTE COMMAND
    */
    context.subscriptions.push(
        vscode.commands.registerCommand("devLeakShield.securePaste", async () => {
            await securePaste();
        })
    );

    /*
    WORKSPACE AI LOCK COMMANDS
    */
    context.subscriptions.push(
        vscode.commands.registerCommand("devLeakShield.maskSecrets", async () => {
            masking = true;
            try {
                await lockWorkspace();
                vscode.window.showInformationMessage("Workspace Locked for AI");
            } finally {
                masking = false;
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("devLeakShield.restoreSecrets", async () => {
            masking = true;
            try {
                await unlockWorkspace();
                vscode.window.showInformationMessage("Workspace Unlocked securely");
            } finally {
                masking = false;
            }
        })
    );

}

/*
EXTENSION STOP
*/
export function deactivate() { }