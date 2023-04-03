import { ReactNode, useEffect, useState } from "react";

let globalZ = 0;
export type Position = { top: number, left: number };
export function Draggable({
    position, children,
}: {
    position: Position,
    children: ReactNode,
}) {
    let [dragging, setDragging] = useState(false);
    let [offset, setOffset] = useState({ top: 0, left: 0 });
    let [zIndex, setZIndex] = useState(globalZ++);
    useEffect(() => {
        const handleMouseUp = () => {
            setDragging(false);
        };

        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);
    return <div style={{
        position: 'relative',
        top: position.top + offset.top,
        left: position.left + offset.left,
        zIndex,
    }}
        onMouseDown={function () {
            setDragging(true);
            setZIndex(() => globalZ++);
        }}
        onMouseMove={function ({ movementX, movementY }) {
            if (dragging) {
                setOffset(offset => ({
                    left: offset.left + movementX,
                    top: offset.top + movementY,
                }));
            }
        }}
    >{children}</div>;
}