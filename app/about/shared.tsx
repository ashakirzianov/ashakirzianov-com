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
        <div className="flex flex-col items-center justify-center w-screen p-stn pixel-shadow">
            <div className="bg-paper-light text-fgl pixel-corners" style={{
                maxWidth: 'min(540pt, 100%)',
            }}>
                <TextBlock font="var(--font-pixel)">
                    {children}
                </TextBlock>
            </div>
        </div>
    </>
}