export function getViewportDimensions() {
    // Fallback for SSR
    if (!global.window || !global.document) {
        return {
            width: 1000,
            height: 1000,
        }
    }

    // Get the viewport width and height with fallbacks for older browsers
    const viewportWidth = window.innerWidth ?? document.documentElement.clientWidth ?? document.body.clientWidth
    const viewportHeight = window.innerHeight ?? document.documentElement.clientHeight ?? document.body.clientHeight

    // Get the device pixel ratio; default to 1 for older browsers
    const devicePixelRatio = window.devicePixelRatio ?? 1

    // Calculate the dimensions in points
    const viewportWidthInPoints = viewportWidth / devicePixelRatio
    const viewportHeightInPoints = viewportHeight / devicePixelRatio

    return {
        width: viewportWidthInPoints,
        height: viewportHeightInPoints,
    }
}

export function filterUndefined<T>(arr: Array<T | undefined>): T[] {
    return arr.filter((v): v is T => v !== undefined)
}