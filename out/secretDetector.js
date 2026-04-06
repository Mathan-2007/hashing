"use strict";
/*
Detect secrets inside a piece of text
Returns a list of detected secrets
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectSecrets = detectSecrets;
function detectSecrets(text) {
    const patterns = [
        /sk-[a-zA-Z0-9]{10,}/g, // OpenAI style keys
        /api[_-]?key\s*=\s*(["'][^"']+["'])/gi, // API keys
        /password\s*=\s*(["'][^"']+["'])/gi, // passwords
        /token\s*=\s*(["'][^"']+["'])/gi, // tokens
        /secret\s*=\s*(["'][^"']+["'])/gi, // secrets
        /AKIA[0-9A-Z]{16}/g, // AWS keys
        /ghp_[A-Za-z0-9]{20,}/g // GitHub tokens
    ];
    let results = [];
    for (const pattern of patterns) {
        let match;
        // Construct a new RegExp to avoid mutating the g-flag between searches
        const regex = new RegExp(pattern.source, pattern.flags);
        while ((match = regex.exec(text)) !== null) {
            // Push capture group 1 if it exists (the secret val), else full match (for direct tokens)
            results.push(match[1] ? match[1] : match[0]);
        }
    }
    return results;
}
//# sourceMappingURL=secretDetector.js.map