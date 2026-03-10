/**
 * encoder.ts
 *
 * Encodes sensitive values into random-looking tokens and persists token -> secret mapping.
 */

import * as crypto from 'node:crypto';
import * as vscode from 'vscode';
import { SecretMatch } from './secretDetector';
import { getOrCreateLocalKey, readSecrets, writeSecrets } from './storage';

function buildToken(key: string, value: string): string {
  const nonce = crypto.randomBytes(8).toString('hex');
  const digest = crypto
    .createHmac('sha256', key)
    .update(`${value}:${nonce}`)
    .digest('base64url')
    .slice(0, 8)
    .toUpperCase();

  return `ENC_${digest}`;
}

export interface EncodeResult {
  encodedText: string;
  replacements: number;
}

export function encodeSecretsInText(
  context: vscode.ExtensionContext,
  text: string,
  matches: SecretMatch[]
): EncodeResult {
  if (matches.length === 0) {
    return { encodedText: text, replacements: 0 };
  }

  const key = getOrCreateLocalKey(context);
  const existingMappings = readSecrets(context);

  // Apply replacements from end to start so index offsets stay valid.
  const reversed = [...matches].sort((a, b) => b.start - a.start);
  let output = text;
  let replacements = 0;

  for (const match of reversed) {
    const token = buildToken(key, match.value);
    existingMappings[token] = match.value;

    output = `${output.slice(0, match.start)}${token}${output.slice(match.end)}`;
    replacements += 1;
  }

  writeSecrets(context, existingMappings);
  return { encodedText: output, replacements };
}
