# DevLeakShield

DevLeakShield is a VS Code extension that helps prevent accidental sensitive-data leakage when copying code to external tools (including AI chatbots).

## What it does

- Scans selected text for likely secrets (API keys, tokens, passwords, private URLs, internal paths, and `.env`-style assignments).
- Replaces detected secret values with encoded placeholders such as `ENC_A92KF123`.
- Stores local placeholder-to-original mapping in `secrets.json` under the extension global storage directory.
- Uses a local secret key (`encoding.key`) to generate token IDs using HMAC-based randomization.
- Provides secure copy/paste commands:
  - `devLeakShield.secureCopy`
  - `devLeakShield.securePaste`

## Commands

### Secure Copy

Command: `DevLeakShield: Secure Copy`

Workflow:
1. Reads selected editor text.
2. Detects sensitive values with regex rules.
3. Encodes them as `ENC_...` placeholders.
4. Writes encoded text to clipboard with `vscode.env.clipboard.writeText()`.

### Secure Paste

Command: `DevLeakShield: Secure Paste`

Workflow:
1. Reads clipboard content.
2. Detects encoded `ENC_...` tokens.
3. Replaces known tokens with original values from local mapping.
4. Pastes decoded content into the active editor.

## Development

```bash
npm install
npm run compile
```

Run in VS Code Extension Development Host with `F5`.
