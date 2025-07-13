export async function loadImage(src: string): Promise<HTMLImageElement> {
    if (typeof window === 'undefined') {
        // Server-side context (CLI)
        const { loadImage } = await import('canvas')
        // For CLI, resolve relative paths to absolute file paths
        const imagePath = src.startsWith('/') ? `./public${src}` : src
        return await loadImage(imagePath) as any
    } else {
        // Browser context
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = src
        })
    }
}