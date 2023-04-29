type RefKind = 'home' | 'text' | 'art' | 'about' | 'about-en';
export function href(kind: RefKind, options?: {
    id?: string,
    hue?: number,
}) {
    let { id, hue } = options ?? {};
    let result = hrefPrefix(kind);
    if (id !== undefined) {
        result = `${result}/${id}`;
    }
    if (hue !== undefined) {
        result = `${result}?hue=${hue}`
    }
    return result;
}

function hrefPrefix(kind: RefKind, id?: string) {
    switch (kind) {
        case 'art':
            return '/art';
        case 'text':
            return '/texts';
        case 'about':
            return '/about';
        case 'about-en':
            return '/about-en';
        case 'home':
        default:
            return '/';
    }
}