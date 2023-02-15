import { ReactNode } from "react";

export function Card({ children }: {
    children?: ReactNode,
}) {
    return <div className="card">
        {children ?? null}
        <style jsx>{`
        .card {
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            border-radius: 5px;
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
        }
        `}</style>
    </div>;
}