import { CSSProperties, ReactNode, useEffect, useState } from "react";

let globalZ = 0;
export type Position = { top: number, left: number };
export function Draggable({
    position, children, onClick, cursor,
}: {
    position: Position,
    children: ReactNode,
    cursor?: CSSProperties['cursor'],
    onClick?: () => void,
}) {
    let [dragging, setDragging] = useState(false);
    let [dragged, setDragged] = useState(false);
    let [offset, setOffset] = useState({ top: 0, left: 0 });
    let [zIndex, setZIndex] = useState(globalZ);
    useEffect(() => {
        const handleMouseUp = () => {
            setDragged(false);
            setDragging(false);
        };

        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);
    let [cursorChanged, setCursorChanged] = useState(false);
    return <div style={{
        position: 'relative',
        top: position.top + offset.top,
        left: position.left + offset.left,
        zIndex,
        cursor: cursorChanged ? 'grab' : cursor,
    }}
        onMouseDown={function (event) {
            setDragging(true);
            setZIndex(() => globalZ++);
        }}
        onMouseUp={function (event) {
            if (!dragged && onClick) {
                onClick();
            }
        }}
        onMouseMove={function ({ movementX, movementY }) {
            if (dragging) {
                setDragged(true);
                setOffset(offset => ({
                    left: offset.left + movementX,
                    top: offset.top + movementY,
                }));
            }
        }}
        onMouseEnter={function () {
            setTimeout(() => setCursorChanged(true), 1000);
        }}
        onMouseOut={function () {
            setCursorChanged(false);
        }}
    >{children}</div>;
}