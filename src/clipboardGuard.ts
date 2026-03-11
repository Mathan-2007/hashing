import * as vscode from "vscode";
import { detectSecrets } from "./secretDetector";
import { encodeSecret } from "./encoder";
import { storeSecret } from "./storage";

export async function secureCopy() {

    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    let selection = editor.selection;
    let text = "";

    if (selection.isEmpty) {
        // copy current line if nothing selected
        const line = editor.document.lineAt(selection.active.line);
        text = line.text;
    } else {
        text = editor.document.getText(selection);
    }

    const secrets = detectSecrets(text);

    for (let secret of secrets) {

        const encoded = encodeSecret();

        storeSecret(encoded, secret);

        text = text.replace(secret, encoded);
    }

    await vscode.env.clipboard.writeText(text);
}