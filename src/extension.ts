import * as vscode from "vscode";
import { secureCopy } from "./clipboardGuard";
import { secretMap, getOriginal } from "./storage";

export function activate(context: vscode.ExtensionContext) {

    const copyCommand = vscode.commands.registerCommand(
        "devLeakShield.secureCopy",
        secureCopy
    );

    const pasteCommand = vscode.commands.registerCommand(
        "devLeakShield.securePaste",
        async () => {

            const editor = vscode.window.activeTextEditor;
            if (!editor) return;

            let text = await vscode.env.clipboard.readText();

            for (let key of Object.keys(secretMap)) {

                const original = getOriginal(key);

                if (original) {
                    text = text.replace(key, original);
                }
            }

            editor.edit(editBuilder => {
                editBuilder.insert(editor.selection.start, text);
            });

        }
    );

    context.subscriptions.push(copyCommand);
    context.subscriptions.push(pasteCommand);
}

export function deactivate() {}