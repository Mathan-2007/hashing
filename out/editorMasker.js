"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskEditorSecrets = maskEditorSecrets;
exports.restoreEditorSecrets = restoreEditorSecrets;
const vscode = require("vscode");
const secretDetector_1 = require("./secretDetector");
const encoder_1 = require("./encoder");
let maskedSecrets = new Map();
/*
MASK SECRETS IN EDITOR
*/
async function maskEditorSecrets(editor) {
    const text = editor.document.getText();
    const secrets = (0, secretDetector_1.detectSecrets)(text);
    await editor.edit(editBuilder => {
        for (let secret of secrets) {
            const encoded = (0, encoder_1.encodeSecret)(secret);
            maskedSecrets.set(encoded, secret);
            const startIndex = text.indexOf(secret);
            if (startIndex === -1)
                continue;
            const start = editor.document.positionAt(startIndex);
            const end = editor.document.positionAt(startIndex + secret.length);
            editBuilder.replace(new vscode.Range(start, end), encoded);
        }
    });
}
/*
RESTORE ORIGINAL VALUES
*/
async function restoreEditorSecrets(editor) {
    const text = editor.document.getText();
    await editor.edit(editBuilder => {
        for (let [encoded, original] of maskedSecrets.entries()) {
            const startIndex = text.indexOf(encoded);
            if (startIndex === -1)
                continue;
            const start = editor.document.positionAt(startIndex);
            const end = editor.document.positionAt(startIndex + encoded.length);
            editBuilder.replace(new vscode.Range(start, end), original);
        }
    });
}
//# sourceMappingURL=editorMasker.js.map