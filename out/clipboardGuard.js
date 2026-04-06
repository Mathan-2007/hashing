"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secureCopy = secureCopy;
exports.securePaste = securePaste;
const vscode = require("vscode");
const secretDetector_1 = require("./secretDetector");
const encoder_1 = require("./encoder");
const decoder_1 = require("./decoder");
/*
SECURE COPY
Encodes secrets before copying to clipboard
*/
async function secureCopy() {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return;
    let selection = editor.selection;
    let text = "";
    if (selection.isEmpty) {
        const line = editor.document.lineAt(selection.active.line);
        text = line.text;
    }
    else {
        text = editor.document.getText(selection);
    }
    const secrets = (0, secretDetector_1.detectSecrets)(text);
    for (let secret of secrets) {
        if (secret.startsWith("HIDDEN_SECRET_DO_NOT_DECODE_"))
            continue;
        const encoded = (0, encoder_1.encodeSecret)(secret);
        text = text.replaceAll(secret, encoded);
    }
    await vscode.env.clipboard.writeText(text);
    vscode.window.showInformationMessage("DevLeakShield: secrets encoded before copy");
}
/*
SECURE PASTE
Decodes encrypted tokens when pasting
*/
async function securePaste() {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return;
    let text = await vscode.env.clipboard.readText();
    const matches = text.match(/HIDDEN_SECRET_DO_NOT_DECODE_[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+/g);
    if (matches) {
        for (let token of matches) {
            try {
                const decoded = (0, decoder_1.decodeSecret)(token);
                text = text.replaceAll(token, decoded);
            }
            catch (err) {
                console.log("DevLeakShield decode failed:", err);
            }
        }
    }
    editor.edit(editBuilder => {
        editBuilder.replace(editor.selection, text);
    });
}
//# sourceMappingURL=clipboardGuard.js.map