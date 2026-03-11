"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secureCopy = secureCopy;
const vscode = require("vscode");
const secretDetector_1 = require("./secretDetector");
const encoder_1 = require("./encoder");
const storage_1 = require("./storage");
async function secureCopy() {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return;
    let selection = editor.selection;
    let text = "";
    if (selection.isEmpty) {
        // copy current line if nothing selected
        const line = editor.document.lineAt(selection.active.line);
        text = line.text;
    }
    else {
        text = editor.document.getText(selection);
    }
    const secrets = (0, secretDetector_1.detectSecrets)(text);
    for (let secret of secrets) {
        const encoded = (0, encoder_1.encodeSecret)();
        (0, storage_1.storeSecret)(encoded, secret);
        text = text.replace(secret, encoded);
    }
    await vscode.env.clipboard.writeText(text);
}
//# sourceMappingURL=clipboardGuard.js.map