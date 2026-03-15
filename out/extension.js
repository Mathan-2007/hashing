"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const clipboardGuard_1 = require("./clipboardGuard");
const cryptoSession_1 = require("./cryptoSession");
const workspaceLocker_1 = require("./workspaceLocker");
/*
Prevent infinite masking loops
*/
let masking = false;
async function activate(context) {
    // Initialize Persistent Memory Crypto Key
    await (0, cryptoSession_1.initCryptoSession)(context);
    console.log("DevLeakShield activated");
    /*
    SECURE COPY COMMAND
    */
    context.subscriptions.push(vscode.commands.registerCommand("devLeakShield.secureCopy", async () => {
        await (0, clipboardGuard_1.secureCopy)();
    }));
    /*
    SECURE PASTE COMMAND
    */
    context.subscriptions.push(vscode.commands.registerCommand("devLeakShield.securePaste", async () => {
        await (0, clipboardGuard_1.securePaste)();
    }));
    /*
    WORKSPACE AI LOCK COMMANDS
    */
    context.subscriptions.push(vscode.commands.registerCommand("devLeakShield.maskSecrets", async () => {
        masking = true;
        try {
            await (0, workspaceLocker_1.lockWorkspace)();
            vscode.window.showInformationMessage("Workspace Locked for AI");
        }
        finally {
            masking = false;
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand("devLeakShield.restoreSecrets", async () => {
        masking = true;
        try {
            await (0, workspaceLocker_1.unlockWorkspace)();
            vscode.window.showInformationMessage("Workspace Unlocked securely");
        }
        finally {
            masking = false;
        }
    }));
}
/*
EXTENSION STOP
*/
function deactivate() { }
//# sourceMappingURL=extension.js.map