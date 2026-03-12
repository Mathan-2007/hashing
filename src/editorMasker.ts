import * as vscode from "vscode";
import { detectSecrets } from "./secretDetector";
import { encodeSecret } from "./encoder";
import { decodeSecret } from "./decoder";

let maskedSecrets: Map<string,string> = new Map();

/*
MASK SECRETS IN EDITOR
*/
export async function maskEditorSecrets(editor: vscode.TextEditor) {

    const text = editor.document.getText();

    const secrets = detectSecrets(text);

    await editor.edit(editBuilder => {

        for (let secret of secrets) {

            const encoded = encodeSecret(secret);

            maskedSecrets.set(encoded, secret);

            const startIndex = text.indexOf(secret);

            if (startIndex === -1) continue;

            const start = editor.document.positionAt(startIndex);
            const end = editor.document.positionAt(startIndex + secret.length);

            editBuilder.replace(new vscode.Range(start,end), encoded);
        }

    });

}

/*
RESTORE ORIGINAL VALUES
*/
export async function restoreEditorSecrets(editor: vscode.TextEditor) {

    const text = editor.document.getText();

    await editor.edit(editBuilder => {

        for (let [encoded, original] of maskedSecrets.entries()) {

            const startIndex = text.indexOf(encoded);

            if (startIndex === -1) continue;

            const start = editor.document.positionAt(startIndex);
            const end = editor.document.positionAt(startIndex + encoded.length);

            editBuilder.replace(new vscode.Range(start,end), original);

        }

    });

}