export let secretMap: Record<string, string> = {};

export function storeSecret(encoded: string, original: string) {
    secretMap[encoded] = original;
}

export function getOriginal(encoded: string) {
    return secretMap[encoded];
}