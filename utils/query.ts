import { useSearchParams } from "next/navigation"

function getNumber(s: string | null) {
    if (s === null) {
        return undefined
    } else {
        return parseInt(s, 10)
    }
}

export function useQuery() {
    let sp = useSearchParams()
    return {
        hue: getNumber(sp.get('hue')),
    }
}