import * as vscode from "vscode";
import { detectSecrets } from "./secretDetector";
import { encodeSecret } from "./encoder";
import { decodeSecret } from "./decoder";

/*
Store mapping between encoded value and original secret
*/
const maskedSecrets: Map<string, string> = new Map();

/*
MASK SECRETS IN EDITOR
This replaces secrets with encrypted tokens
*/
export async function maskEditorSecrets(editor: vscode.TextEditor) {

    const document = editor.document;
    const text = document.getText();

    const secrets = detectSecrets(text);

    if (secrets.length === 0) return;

    await editor.edit(editBuilder => {

        for (const secret of secrets) {

            if (secret.startsWith("ENC_")) continue;

            const encoded = encodeSecret(secret);

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
export async function restoreEditorSecrets(editor: vscode.TextEditor) {

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