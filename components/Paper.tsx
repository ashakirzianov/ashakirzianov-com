import { ReactNode } from "react";

export function Paper({ children }: {
    children: ReactNode,
}) {
    return <div className="paper">
        {children}
        <style jsx>{`
        .paper
        {
            position:relative;
            filter: drop-shadow(0px 0px 5px rgba(0,0,0,.1));
        }
        .paper:before, .paper:after
        {
            content:"";
            position:absolute;
            z-index:-1;
            box-shadow: 5px 0 20px rgba(0,0,0,0.1),
            -5px 0 20px rgba(0,0,0,0.1);
            top:10px;
            bottom:10px;
            left:0;
            right:0;
            border-radius:100px / 10px;
        }
        .paper:after
        {
            right:10px;
            left:auto;
            transform:skew(8deg) rotate(3deg);
        }
        `}</style>
    </div>;
}