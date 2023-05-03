type RefKind = 'home' | 'text' | 'sketch' | 'about' | 'about-en' | 'wip';
export function href(kind: RefKind, options?: {
    id?: string,
    collection?: string,
    hue?: number,
}) {
    let { id, collection, hue } = options ?? {}
    let result = hrefPrefix(kind)
    if (collection !== undefined) {
        result = `${result}/${collection}`
    }
    if (id !== undefined) {
        result = `${result}/${id}`
    }
    if (hue !== undefined) {
        result = `${result}?hue=${hue}`
    }
    return result
}

function hrefPrefix(kind: RefKind) {
    switch (kind) {
        case 'sketch':
            return '/sketches'
        case 'wip':
            return '/wip'
        case 'text':
            return '/texts'
        case 'about':
            return '/about'
        case 'about-en':
            return '/about-en'
        case 'home':
        default:
            return '/'
    }
}