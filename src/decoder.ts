export function decode(encoded: string, map: any) {

    if (map[encoded]) {
        return map[encoded];
    }

    return encoded;
}