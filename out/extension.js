"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const editorMasker_1 = require("./editorMasker");
const clipboardGuard_1 = require("./clipboardGuard");
/*
Prevent infinite masking loops
*/
let masking = false;
/*
EXTENSION START
*/
// MASK CURRENT EDITOR WHEN EXTENSION STARTS
if (vscode.window.activeTextEditor) {
    masking = true;
    (0, editorMasker_1.maskEditorSecrets)(vscode.window.activeTextEditor).then(() => {
        masking = false;
    });
}
function activate(context) {
    console.log("DevLeakShield activated");
    /*
    AUTO MASK WHEN FILE OPENS
    */
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(async (document) => {
        const editor = vscode.window.visibleTextEditors.find(e => e.document === document);
        if (!editor)
            return;
        if (masking)
            return;
        masking = true;
        await (0, editorMasker_1.maskEditorSecrets)(editor);
        masking = false;
    }));
    /*
    MASK WHEN FILE CONTENT CHANGES
    */
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(async (event) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        if (event.document !== editor.document)
            return;
        if (masking)
            return;
        masking = true;
        await (0, editorMasker_1.maskEditorSecrets)(editor);
        masking = false;
    }));
    /*
    RESTORE SECRETS BEFORE FILE SAVE
    */
    context.subscriptions.push(vscode.workspace.onWillSaveTextDocument(async (event) => {
        const editor = vscode.window.visibleTextEditors.find(e => e.document === event.document);
        if (!editor)
            return;
        await (0, editorMasker_1.restoreEditorSecrets)(editor);
    }));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(async (editor) => {
        if (!editor)
            return;
        if (masking)
            return;
        masking = true;
        await (0, editorMasker_1.maskEditorSecrets)(editor);
        masking = false;
    }));
    /*
    SECURE COPY COMMAND
    */
    const copyCommand = vscode.commands.registerCommand("devLeakShield.secureCopy", async () => {
        await (0, clipboardGuard_1.secureCopy)();
    });
    /*
    SECURE PASTE COMMAND
    */
    const pasteCommand = vscode.commands.registerCommand("devLeakShield.securePaste", async () => {
        await (0, clipboardGuard_1.securePaste)();
    });
    context.subscriptions.push(copyCommand);
    context.subscriptions.push(pasteCommand);
}
/*
EXTENSION STOP
*/
function deactivate() { }
//# sourceMappingURL=extension.js.map