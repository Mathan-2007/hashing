/*
Detect secrets inside a piece of text
Returns a list of detected secrets
*/

export function detectSecrets(text: string): string[] {

    const patterns = [

        /sk-[a-zA-Z0-9]{10,}/g,                        // OpenAI style keys
        /api[_-]?key\s*=\s*["'][^"']+["']/gi,          // API keys
        /password\s*=\s*["'][^"']+["']/gi,             // passwords
        /token\s*=\s*["'][^"']+["']/gi,                // tokens
        /secret\s*=\s*["'][^"']+["']/gi,               // secrets
        /AKIA[0-9A-Z]{16}/g,                          // AWS keys
        /ghp_[A-Za-z0-9]{20,}/g                       // GitHub tokens

    ];

    let results: string[] = [];

    for (const pattern of patterns) {

        const matches = text.match(pattern);

        if (matches) {
            results.push(...matches);
        }

    }

    return results;
}