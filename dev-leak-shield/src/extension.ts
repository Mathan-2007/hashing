/**
 * extension.ts
 *
 * Entry point for DevLeakShield extension activation.
 */

import * as vscode from 'vscode';
import { registerClipboardGuard } from './clipboardGuard';

export function activate(context: vscode.ExtensionContext): void {
  const disposables = registerClipboardGuard(context);
  context.subscriptions.push(...disposables);

  vscode.window.setStatusBarMessage('DevLeakShield active', 2000);
}

export function deactivate(): void {
  // No-op; subscriptions are disposed by VS Code.
}
