import * as vscode from "vscode";
import { detectSecrets } from "./secretDetector";
import { encodeSecret } from "./encoder";
import { decodeSecret } from "./decoder";

/*
SECURE COPY
Encodes secrets before copying to clipboard
*/
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

        if (secret.startsWith("ENC_")) continue;

        const encoded = encodeSecret(secret);

        text = text.replaceAll(secret, encoded);

    }

    await vscode.env.clipboard.writeText(text);

    vscode.window.showInformationMessage(
        "DevLeakShield: secrets encoded before copy"
    );

}

/*
SECURE PASTE
Decodes encrypted tokens when pasting
*/
export async function securePaste() {

    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    let text = await vscode.env.clipboard.readText();

    const matches = text.match(/ENC_[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+/g);

    if (matches) {

        for (let token of matches) {

            try {

                const decoded = decodeSecret(token);

                text = text.replace(token, decoded);

            } catch (err) {

                console.log("DevLeakShield decode failed:", err);

            }

        }

    }

    editor.edit(editBuilder => {
        editBuilder.insert(editor.selection.start, text);
    });

}