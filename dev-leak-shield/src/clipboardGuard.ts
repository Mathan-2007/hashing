/**
 * clipboardGuard.ts
 *
 * Implements secure copy / secure paste actions and hooks them to VS Code commands.
 */

import * as vscode from 'vscode';
import { detectSecrets } from './secretDetector';
import { encodeSecretsInText } from './encoder';
import { decodeSecretsInText } from './decoder';

function getSelectionText(editor: vscode.TextEditor): string {
  const { selection, document } = editor;
  if (selection.isEmpty) {
    return '';
  }

  return document.getText(selection);
}

export function registerClipboardGuard(
  context: vscode.ExtensionContext
): vscode.Disposable[] {
  const secureCopyDisposable = vscode.commands.registerCommand(
    'devLeakShield.secureCopy',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage('DevLeakShield: no active editor for copy.');
        return;
      }

      const selectedText = getSelectionText(editor);
      if (!selectedText) {
        await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
        return;
      }

      const matches = detectSecrets(selectedText);
      const { encodedText, replacements } = encodeSecretsInText(
        context,
        selectedText,
        matches
      );

      await vscode.env.clipboard.writeText(encodedText);
      const msg =
        replacements > 0
          ? `DevLeakShield: ${replacements} sensitive value(s) encoded and copied.`
          : 'DevLeakShield: no sensitive values detected; copied as-is.';

      vscode.window.setStatusBarMessage(msg, 3000);
    }
  );

  const securePasteDisposable = vscode.commands.registerCommand(
    'devLeakShield.securePaste',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage('DevLeakShield: no active editor for paste.');
        return;
      }

      const clipboardText = await vscode.env.clipboard.readText();
      const { decodedText, replacements } = decodeSecretsInText(context, clipboardText);

      await editor.edit((builder) => {
        builder.replace(editor.selection, decodedText);
      });

      const msg =
        replacements > 0
          ? `DevLeakShield: decoded ${replacements} token(s) while pasting.`
          : 'DevLeakShield: pasted clipboard content.';

      vscode.window.setStatusBarMessage(msg, 3000);
    }
  );

  return [secureCopyDisposable, securePasteDisposable];
}
