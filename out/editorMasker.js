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
    const rawSecrets = (0, secretDetector_1.detectSecrets)(text);
    // Deduplicate secrets to avoid overlapping edit exceptions
    const secrets = Array.from(new Set(rawSecrets));
    if (secrets.length === 0)
        return;
    await editor.edit(editBuilder => {
        for (const secret of secrets) {
            if (secret.startsWith("HIDDEN_SECRET_DO_NOT_DECODE_"))
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
Returns an array of TextEdits to be used with event.waitUntil()
*/
async function restoreEditorSecrets(editor) {
    const document = editor.document;
    const text = document.getText();
    const edits = [];
    for (const [encoded, original] of maskedSecrets.entries()) {
        let index = text.indexOf(encoded);
        while (index !== -1) {
            const start = document.positionAt(index);
            const end = document.positionAt(index + encoded.length);
            edits.push(vscode.TextEdit.replace(new vscode.Range(start, end), original));
            index = text.indexOf(encoded, index + encoded.length);
        }
    }
    return edits;
}
//# sourceMappingURL=editorMasker.js.map