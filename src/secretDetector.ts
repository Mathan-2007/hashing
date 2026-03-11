export function detectSecrets(text: string): string[] {

    const patterns = [
        /sk-[a-zA-Z0-9]+/g,                 // OpenAI style keys
        /api[_-]?key\s*=\s*["'][^"']+["']/gi,
        /password\s*=\s*["'][^"']+["']/gi,
        /token\s*=\s*["'][^"']+["']/gi,
        /secret\s*=\s*["'][^"']+["']/gi
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
