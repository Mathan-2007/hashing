"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskEditorSecrets = maskEditorSecrets;
exports.restoreEditorSecrets = restoreEditorSecrets;
const vscode = require("vscode");
const secretDetector_1 = require("./secretDetector");
const encoder_1 = require("./encoder");
/*
Store mapping between encoded value and original secret
*/
const maskedSecrets = new Map();
/*
MASK SECRETS IN EDITOR
This replaces secrets with encrypted tokens
*/
async function maskEditorSecrets(editor) {
    const document = editor.document;
    const text = document.getText();
    const secrets = (0, secretDetector_1.detectSecrets)(text);
    if (secrets.length === 0)
        return;
    await editor.edit(editBuilder => {
        for (const secret of secrets) {
            if (secret.startsWith("ENC_"))
                continue;
            const encoded = (0, encoder_1.encodeSecret)(secret);
            maskedSecrets.set(encoded, secret);
            let index = text.indexOf(secret);
            while (index !== -1) {
                const start = document.positionAt(index);
                const end = document.positionAt(index + secret.length);
                editBuilder.replace(new vscode.Range(start, end), encoded);
                index = text.indexOf(secret, index + secret.length);
            }
        }
    });
}
/*
RESTORE ORIGINAL SECRETS
Used when saving file
*/
async function restoreEditorSecrets(editor) {
    const document = editor.document;
    const text = document.getText();
    await editor.edit(editBuilder => {
        for (const [encoded, original] of maskedSecrets.entries()) {
            let index = text.indexOf(encoded);
            while (index !== -1) {
                const start = document.positionAt(index);
                const end = document.positionAt(index + encoded.length);
                editBuilder.replace(new vscode.Range(start, end), original);
                index = text.indexOf(encoded, index + encoded.length);
            }
        }
    });
}
//# sourceMappingURL=editorMasker.js.map