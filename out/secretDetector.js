"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectSecrets = detectSecrets;
function detectSecrets(text) {
    const patterns = [
        /sk-[a-zA-Z0-9]+/g, // OpenAI style keys
        /api[_-]?key\s*=\s*["'][^"']+["']/gi,
        /password\s*=\s*["'][^"']+["']/gi,
        /token\s*=\s*["'][^"']+["']/gi,
        /secret\s*=\s*["'][^"']+["']/gi
    ];
    let results = [];
    for (const pattern of patterns) {
        const matches = text.match(pattern);
        if (matches) {
            results.push(...matches);
        }
    }
    return results;
}
//# sourceMappingURL=secretDetector.js.map