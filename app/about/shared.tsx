import { TextBlock } from "@/components/TextBlock"
import Link from "next/link"
import { ReactNode } from "react"

export function AboutLink({ href, children }: {
    href: string,
    children: ReactNode,
}) {
    return <Link href={href} style={{
        color: 'skyblue',
    }}>
        {children}
    </Link>
}

export function AboutCard({ children }: {
    children: ReactNode,
}) {
    return <>
        <div className="container pixel-shadow">
            <div className="content pixel-corners">
                <TextBlock font="var(--font-pixel)">
                    {children}
                </TextBlock>
            </div>
        </div>
        <style jsx>{`
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100vw;
            padding: var(--padding);
        }
        .content {
            background-color: var(--paper-light);
            color: var(--foreground-light);
            max-width: min(540pt, 100%);
        }
        `}</style>
    </>
}