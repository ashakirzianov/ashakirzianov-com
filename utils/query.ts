import { useRouter } from "next/router";

function getNumber(s: string | string[] | undefined) {
    if (s === undefined) {
        return undefined;
    } else if (typeof s === 'string') {
        return parseInt(s, 10);
    } else {
        return parseInt(s[0] ?? '', 10);
    }
}

export function useQuery() {
    let { hue } = useRouter().query;
    return {
        hue: getNumber(hue),
    };
}