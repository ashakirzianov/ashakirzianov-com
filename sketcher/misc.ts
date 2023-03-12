export function removeUndefined<T>(array: Array<T | undefined>): T[] {
    let result: T[] = [];
    for (let element of array) {
        if (element !== undefined) {
            result.push(element);
        }
    }
    return result;
}

export function modItem<T>(arr: T[], idx: number): T {
    return arr[idx % arr.length]!;
}

export function vals<T>(count: number, val?: T): T[] {
    return Array(count).fill(val);
}

export function nums(to: number, from?: number): number[] {
    let result = [];
    for (let n = from ?? 0; n < to; n++) {
        result.push(n);
    }
    return result;
}

export function breakIntoLines(text: string, lineLength: number): string[] {
    if (lineLength <= 0) {
        return [text];
    }
    let lines = [];
    let current = '';
    let words = text.split(' ');
    for (let word of words) {
        while (word.length > lineLength) {
            if (current !== '') {
                lines.push(current);
                current = '';
            }
            let front = word.substring(0, lineLength);
            lines.push(front);
            word = word.substring(lineLength);
        }
        let next = current === '' ? word : `${current} ${word}`;
        if (next.length > lineLength) {
            lines.push(current);
            current = word;
        } else {
            current = next;
        }
    }
    if (current !== '') {
        lines.push(current);
    }
    return lines;
}