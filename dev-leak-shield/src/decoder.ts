/**
 * decoder.ts
 *
 * Replaces encoded tokens (ENC_*) with original values from local mapping.
 */

import * as vscode from 'vscode';
import { readSecrets } from './storage';

const ENCODED_TOKEN_REGEX = /ENC_[A-Z0-9]{6,}/g;

export interface DecodeResult {
  decodedText: string;
  replacements: number;
}

export function decodeSecretsInText(
  context: vscode.ExtensionContext,
  text: string
): DecodeResult {
  const mappings = readSecrets(context);
  let replacements = 0;

  const decodedText = text.replace(ENCODED_TOKEN_REGEX, (token) => {
    const original = mappings[token];
    if (!original) {
      return token;
    }

    replacements += 1;
    return original;
  });

  return { decodedText, replacements };
}
