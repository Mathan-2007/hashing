import * as vscode from "vscode";
import { maskEditorSecrets, restoreEditorSecrets } from "./editorMasker";
import { secureCopy, securePaste } from "./clipboardGuard";

import { initCryptoSession } from "./cryptoSession";
import { lockWorkspace, unlockWorkspace } from "./workspaceLocker";

/*
Prevent infinite masking loops
*/
let masking = false;
let blurTimeout: NodeJS.Timeout | null = null;
let aiMode = false;
let statusBarItem: vscode.StatusBarItem;

export async function activate(context: vscode.ExtensionContext) {

    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left
    );
    statusBarItem.text = "🔓 DevLeakShield";
    statusBarItem.command = "devLeakShield.toggleAiMode";
    statusBarItem.show();

    // 🔥 TEMP KEY (remove context if you changed crypto)
    initCryptoSession();

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

    context.subscriptions.push(
    vscode.commands.registerCommand("devLeakShield.toggleAiMode", async () => {

        aiMode = !aiMode;

        masking = true;

        try {
            if (aiMode) {
                await lockWorkspace();
                statusBarItem.text = "🔒 AI Mode ON";
                vscode.window.showInformationMessage("AI Mode Enabled (Secrets Protected)");
            } else {
                await unlockWorkspace();
                statusBarItem.text = "🔓 AI Mode OFF";
                vscode.window.showInformationMessage("AI Mode Disabled (Secrets Restored)");
            }
        } catch (err) {
            console.log("AI Mode toggle failed:", err);
        } finally {
            masking = false;
        }

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

    // ✅🔥 CRITICAL: Restore secrets before saving
    context.subscriptions.push(
        vscode.workspace.onWillSaveTextDocument(async () => {

            if (masking) return;

            try {
                for (const editor of vscode.window.visibleTextEditors) {

                    const edits = await restoreEditorSecrets(editor);
                    if (edits.length === 0) continue;

                    await editor.edit(editBuilder => {
                        for (const edit of edits) {
                            editBuilder.replace(edit.range, edit.newText);
                        }
                    });
                }

                console.log("Secrets restored before save");

            } catch (err) {
                console.log("Restore failed:", err);
            }
        })
    );


    // 🔥 ADD THIS HERE (inside activate, before closing bracket)
    context.subscriptions.push(
        vscode.window.onDidChangeWindowState((state) => {

            if (masking) return;
            if (state.focused) return;

            // 🧠 debounce (wait 500ms before running)
            if (blurTimeout) {
                clearTimeout(blurTimeout);
            }

            blurTimeout = setTimeout(async () => {

                try {
                    for (const editor of vscode.window.visibleTextEditors) {

                        const edits = await restoreEditorSecrets(editor);
                        if (edits.length === 0) continue;

                        await editor.edit(editBuilder => {
                            for (const edit of edits) {
                                editBuilder.replace(edit.range, edit.newText);
                            }
                        });
                    }

                    console.log("Secrets restored on window blur");

                } catch (err) {
                    console.log("Blur restore failed:", err);
                }

            }, 500); // delay to avoid spam
        })
    );

}

/*
EXTENSION STOP
*/
export function deactivate() { }