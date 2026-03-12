"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const crypto = require("crypto");
const secretDetector_1 = require("./secretDetector");
const editorMasker_1 = require("./editorMasker");
/*
SESSION KEY
Generated every time VS Code starts
*/
const SESSION_KEY = crypto.randomBytes(32);
const IV = crypto.randomBytes(16);
/*
AES ENCODE
*/
function encodeSecret(text) {
    const cipher = crypto.createCipheriv("aes-256-cbc", SESSION_KEY, IV);
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return "ENC_" + encrypted;
}
/*
AES DECODE
*/
function decodeSecret(text) {
    const value = text.replace("ENC_", "");
    const decipher = crypto.createDecipheriv("aes-256-cbc", SESSION_KEY, IV);
    let decrypted = decipher.update(value, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
/*
EXTENSION START
*/
function activate(context) {
    console.log("DevLeakShield activated");
    /*
    COPY INTERCEPT
    */
    const copyCommand = vscode.commands.registerCommand("devLeakShield.secureCopy", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        let text = editor.document.getText(editor.selection);
        // If nothing selected copy current line
        if (!text) {
            const line = editor.document.lineAt(editor.selection.active.line);
            text = line.text;
        }
        const secrets = (0, secretDetector_1.detectSecrets)(text);
        for (let secret of secrets) {
            const encoded = encodeSecret(secret);
            text = text.replace(secret, encoded);
        }
        await vscode.env.clipboard.writeText(text);
        vscode.window.showInformationMessage("Secrets encoded before copy");
    });
    /*
    PASTE INTERCEPT
    */
    const pasteCommand = vscode.commands.registerCommand("devLeakShield.securePaste", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        let text = await vscode.env.clipboard.readText();
        const matches = text.match(/ENC_[A-Za-z0-9+/=]+/g);
        if (matches) {
            for (let token of matches) {
                try {
                    const decoded = decodeSecret(token);
                    text = text.replace(token, decoded);
                }
                catch (err) {
                    console.log("Decode failed:", err);
                }
            }
        }
        editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.start, text);
        });
    });
    /*
    MASK SECRETS IN EDITOR (for Copilot / AI tools)
    */
    const maskCommand = vscode.commands.registerCommand("devLeakShield.maskSecrets", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        await (0, editorMasker_1.maskEditorSecrets)(editor);
        vscode.window.showInformationMessage("Secrets masked for AI tools");
    });
    /*
    RESTORE ORIGINAL SECRETS
    */
    const restoreCommand = vscode.commands.registerCommand("devLeakShield.restoreSecrets", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        await (0, editorMasker_1.restoreEditorSecrets)(editor);
        vscode.window.showInformationMessage("Secrets restored");
    });
    context.subscriptions.push(copyCommand);
    context.subscriptions.push(pasteCommand);
    context.subscriptions.push(maskCommand);
    context.subscriptions.push(restoreCommand);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map