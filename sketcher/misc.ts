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