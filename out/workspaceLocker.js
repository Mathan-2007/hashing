"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lockWorkspace = lockWorkspace;
exports.unlockWorkspace = unlockWorkspace;
const vscode = require("vscode");
const secretDetector_1 = require("./secretDetector");
const encoder_1 = require("./encoder");
const decoder_1 = require("./decoder");
/*
LOCK WORKSPACE
Scan visible editors (or files if needed) and encrypt secrets down to the disk level.
Since we use text editors to perform masking currently, we will iterate visible text editors.
If required, this can be expanded to scan the entire workspace directory.
*/
async function lockWorkspace() {
    // Encrypt all open tabs
    for (const editor of vscode.window.visibleTextEditors) {
        const document = editor.document;
        const text = document.getText();
        const rawSecrets = (0, secretDetector_1.detectSecrets)(text);
        const secrets = Array.from(new Set(rawSecrets));
        if (secrets.length === 0)
            continue;
        await editor.edit(editBuilder => {
            for (const secret of secrets) {
                if (secret.startsWith("HIDDEN_SECRET_DO_NOT_DECODE_"))
                    continue;
                const encoded = (0, encoder_1.encodeSecret)(secret);
                let index = text.indexOf(secret);
                while (index !== -1) {
                    const start = document.positionAt(index);
                    const end = document.positionAt(index + secret.length);
                    editBuilder.replace(new vscode.Range(start, end), encoded);
                    index = text.indexOf(secret, index + secret.length);
                }
            }
        });
        // Save the encrypted state firmly to disk so AI scanning sees it securely
        await document.save();
    }
}
/*
UNLOCK WORKSPACE
Decodes the encrypted placeholders and saves real keys back to disk.
*/
async function unlockWorkspace() {
    for (const editor of vscode.window.visibleTextEditors) {
        const document = editor.document;
        let text = document.getText();
        const matches = text.match(/HIDDEN_SECRET_DO_NOT_DECODE_[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+/g);
        if (!matches)
            continue;
        const tokens = Array.from(new Set(matches));
        await editor.edit(editBuilder => {
            for (let token of tokens) {
                try {
                    const original = (0, decoder_1.decodeSecret)(token);
                    let index = text.indexOf(token);
                    while (index !== -1) {
                        const start = document.positionAt(index);
                        const end = document.positionAt(index + token.length);
                        editBuilder.replace(new vscode.Range(start, end), original);
                        index = text.indexOf(token, index + token.length);
                    }
                }
                catch (err) {
                    console.log("Unlock decode failed:", err);
                }
            }
        });
        // Save real secrets back to disk for usage
        await document.save();
    }
}
//# sourceMappingURL=workspaceLocker.js.map