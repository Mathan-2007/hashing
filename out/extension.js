"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const editorMasker_1 = require("./editorMasker");
const clipboardGuard_1 = require("./clipboardGuard");
const cryptoSession_1 = require("./cryptoSession");
const workspaceLocker_1 = require("./workspaceLocker");
/*
Prevent infinite masking loops
*/
let masking = false;
let blurTimeout = null;
let aiMode = false;
let statusBarItem;
async function activate(context) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBarItem.text = "🔓 DevLeakShield";
    statusBarItem.command = "devLeakShield.toggleAiMode";
    statusBarItem.show();
    // 🔥 TEMP KEY (remove context if you changed crypto)
    (0, cryptoSession_1.initCryptoSession)();
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
    context.subscriptions.push(vscode.commands.registerCommand("devLeakShield.toggleAiMode", async () => {
        aiMode = !aiMode;
        masking = true;
        try {
            if (aiMode) {
                await (0, workspaceLocker_1.lockWorkspace)();
                statusBarItem.text = "🔒 AI Mode ON";
                vscode.window.showInformationMessage("AI Mode Enabled (Secrets Protected)");
            }
            else {
                await (0, workspaceLocker_1.unlockWorkspace)();
                statusBarItem.text = "🔓 AI Mode OFF";
                vscode.window.showInformationMessage("AI Mode Disabled (Secrets Restored)");
            }
        }
        catch (err) {
            console.log("AI Mode toggle failed:", err);
        }
        finally {
            masking = false;
        }
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
    // ✅🔥 CRITICAL: Restore secrets before saving
    context.subscriptions.push(vscode.workspace.onWillSaveTextDocument(async () => {
        if (masking)
            return;
        try {
            for (const editor of vscode.window.visibleTextEditors) {
                const edits = await (0, editorMasker_1.restoreEditorSecrets)(editor);
                if (edits.length === 0)
                    continue;
                await editor.edit(editBuilder => {
                    for (const edit of edits) {
                        editBuilder.replace(edit.range, edit.newText);
                    }
                });
            }
            console.log("Secrets restored before save");
        }
        catch (err) {
            console.log("Restore failed:", err);
        }
    }));
    // 🔥 ADD THIS HERE (inside activate, before closing bracket)
    context.subscriptions.push(vscode.window.onDidChangeWindowState((state) => {
        if (masking)
            return;
        if (state.focused)
            return;
        // 🧠 debounce (wait 500ms before running)
        if (blurTimeout) {
            clearTimeout(blurTimeout);
        }
        blurTimeout = setTimeout(async () => {
            try {
                for (const editor of vscode.window.visibleTextEditors) {
                    const edits = await (0, editorMasker_1.restoreEditorSecrets)(editor);
                    if (edits.length === 0)
                        continue;
                    await editor.edit(editBuilder => {
                        for (const edit of edits) {
                            editBuilder.replace(edit.range, edit.newText);
                        }
                    });
                }
                console.log("Secrets restored on window blur");
            }
            catch (err) {
                console.log("Blur restore failed:", err);
            }
        }, 500); // delay to avoid spam
    }));
}
/*
EXTENSION STOP
*/
function deactivate() { }
//# sourceMappingURL=extension.js.map