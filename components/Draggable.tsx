import {
    CSSProperties, ReactNode, TouchEvent, useEffect, useRef, useState,
} from "react";

let globalZ = 0;
export type Position = { top: number, left: number };
export function Draggable({
    position, children, onDrag, onStop, cursor,
}: {
    children?: ReactNode,
    position?: Position,
    cursor?: CSSProperties['cursor'],
    onDrag?: () => void,
    onStop?: () => void,
}) {
    let divRef = useRef<HTMLDivElement>(null);
    let [dragging, setDragging] = useState(false);
    let [state, setState] = useState({
        offset: { x: 0, y: 0 },
        touchStart: { x: 0, y: 0 },
    });
    let [zIndex, setZIndex] = useState(globalZ);
    let [cursorChanged, setCursorChanged] = useState(false);

    function handleStartDragging() {
        setDragging(true);
        setZIndex(() => globalZ++);
        setCursorChanged(true);
    }
    function handleEndDragging() {
        if (onStop) {
            onStop();
        }
        setDragging(false);
        setCursorChanged(false);
    }

    useEffect(() => {
        function getPosition(touch: Touch) {
            return {
                x: touch.clientX,
                y: touch.clientY,
            };
        }
        function handleTouchStart(event: globalThis.TouchEvent) {
            let touches = event.targetTouches;
            if (touches.length !== 1) {
                return;
            }
            let touch = event.targetTouches[0]!;
            handleStartDragging();
            let { x, y } = getPosition(touch);
            setState(state => ({
                ...state,
                touchStart: {
                    x: state.offset.x - x,
                    y: state.offset.y - y,
                }
            }));
        }
        function handleTouchMove(event: globalThis.TouchEvent) {
            let touches = event.targetTouches;
            if (touches.length !== 1) {
                return;
            }
            let touch = event.targetTouches[0]!;
            event.preventDefault();
            if (dragging) {
                let { x, y } = getPosition(touch);
                setState(state => ({
                    ...state,
                    offset: {
                        x: state.touchStart.x + x,
                        y: state.touchStart.y + y,
                    },
                }));
                if (onDrag) {
                    onDrag();
                }
            }
        }
        function handleTouchEnd() {
            handleEndDragging();
        }
        let ref = divRef.current;
        if (ref) {
            ref.addEventListener('touchstart', handleTouchStart);
            ref.addEventListener('touchmove', handleTouchMove, { passive: false });
            ref.addEventListener('touchend', handleTouchEnd);
            ref.addEventListener('touchcancel', handleTouchEnd)
        }
        return function cleanup() {
            if (ref) {
                ref.removeEventListener('touchstart', handleTouchStart);
                ref.removeEventListener('touchmove', handleTouchStart);
                ref.removeEventListener('touchend', handleTouchEnd);
                ref.removeEventListener('touchcancel', handleTouchEnd);
            }
        }
    }, [divRef.current])

    useEffect(() => {
        window.addEventListener('mouseup', handleEndDragging);
        window.addEventListener('touchend', handleEndDragging);
        window.addEventListener('touchcancel', handleEndDragging);

        return () => {
            window.removeEventListener('mouseup', handleEndDragging);
            window.removeEventListener('touchend', handleEndDragging);
            window.removeEventListener('touchcancel', handleEndDragging);
        };
    }, []);

    return <div ref={divRef} style={{
        position: 'relative',
        left: (position?.left ?? 0) + state.offset.x,
        top: (position?.top ?? 0) + state.offset.y,
        zIndex,
        cursor: cursorChanged ? 'grab' : undefined,
    }}
        onMouseDown={handleStartDragging}
        onMouseMove={function ({ movementX, movementY }) {
            if (dragging) {
                setState(state => ({
                    ...state,
                    offset: {
                        x: state.offset.x + movementX,
                        y: state.offset.y + movementY,
                    },
                }));
                if (onDrag) {
                    onDrag();
                }
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