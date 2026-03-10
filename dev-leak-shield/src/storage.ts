/**
 * storage.ts
 *
 * Handles local persistence for encoded token mappings and local secret key storage.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import * as vscode from 'vscode';

export interface StoredSecrets {
  [encodedToken: string]: string;
}

interface SecretFiles {
  secretsPath: string;
  keyPath: string;
}

function getStorageDir(context: vscode.ExtensionContext): string {
  const dir = context.globalStorageUri.fsPath;
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function getSecretFiles(context: vscode.ExtensionContext): SecretFiles {
  const dir = getStorageDir(context);
  return {
    secretsPath: path.join(dir, 'secrets.json'),
    keyPath: path.join(dir, 'encoding.key')
  };
}

export function readSecrets(context: vscode.ExtensionContext): StoredSecrets {
  const { secretsPath } = getSecretFiles(context);

  if (!fs.existsSync(secretsPath)) {
    return {};
  }

  const raw = fs.readFileSync(secretsPath, 'utf8');
  if (!raw.trim()) {
    return {};
  }

  return JSON.parse(raw) as StoredSecrets;
}

export function writeSecrets(
  context: vscode.ExtensionContext,
  data: StoredSecrets
): void {
  const { secretsPath } = getSecretFiles(context);
  fs.writeFileSync(secretsPath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Returns a local key used to generate stable token IDs.
 */
export function getOrCreateLocalKey(context: vscode.ExtensionContext): string {
  const { keyPath } = getSecretFiles(context);

  if (fs.existsSync(keyPath)) {
    return fs.readFileSync(keyPath, 'utf8').trim();
  }

  const key = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(keyPath, key, { encoding: 'utf8', mode: 0o600 });
  return key;
}
