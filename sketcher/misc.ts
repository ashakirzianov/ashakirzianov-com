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