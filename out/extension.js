"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const clipboardGuard_1 = require("./clipboardGuard");
const storage_1 = require("./storage");
function activate(context) {
    const copyCommand = vscode.commands.registerCommand("devLeakShield.secureCopy", clipboardGuard_1.secureCopy);
    const pasteCommand = vscode.commands.registerCommand("devLeakShield.securePaste", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        let text = await vscode.env.clipboard.readText();
        for (let key of Object.keys(storage_1.secretMap)) {
            const original = (0, storage_1.getOriginal)(key);
            if (original) {
                text = text.replace(key, original);
            }
        }
        editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.start, text);
        });
    });
    context.subscriptions.push(copyCommand);
    context.subscriptions.push(pasteCommand);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map