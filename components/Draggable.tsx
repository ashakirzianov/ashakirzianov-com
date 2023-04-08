import {
    MouseEvent, ReactNode, useCallback, useEffect, useRef, useState,
} from "react";

let globalZ = 0;
export type Position = { x: number, y: number };
export function Draggable({
    children, onDrag, onStop, front,
}: {
    front?: boolean,
    children?: ReactNode,
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

    function handleStartDragging({ x, y }: Position) {
        setDragging(true);
        setZIndex(() => globalZ++);
        setCursorChanged(true);
        setState(state => ({
            ...state,
            touchStart: {
                x: state.offset.x - x,
                y: state.offset.y - y,
            }
        }));
    }
    let handleDragging = useCallback(function handleDragging({ x, y }: Position) {
        if (dragging) {
            setState(state => {
                let MIN_STEP = 100;
                let dx = Math.abs(x - (state.touchStart.x - state.offset.x));
                let dy = Math.abs(y - (state.touchStart.y - state.offset.y));
                if (dx > MIN_STEP || dy > MIN_STEP) {
                    if (onDrag) {
                        onDrag();
                    }
                    return {
                        ...state,
                        offset: {
                            x: state.touchStart.x + x,
                            y: state.touchStart.y + y,
                        },
                    };
                } else {
                    return state;
                }
            });
        }
    }, [dragging, onDrag]);
    let handleEndDragging = useCallback(function handleEndDragging() {
        if (onStop) {
            onStop();
        }
        setDragging(false);
        setCursorChanged(false);
    }, [onStop]);

    function getTouchPosition(event: globalThis.TouchEvent) {
        let touches = event.targetTouches;
        if (touches.length !== 1) {
            return undefined;
        }
        let touch = event.targetTouches[0]!;
        return {
            x: touch.clientX,
            y: touch.clientY,
        };
    }

    function getMousePosition({ clientX, clientY }: MouseEvent<unknown>) {
        return {
            x: clientX, y: clientY,
        };
    }

    useEffect(() => {
        function handleTouchStart(event: globalThis.TouchEvent) {
            let position = getTouchPosition(event);
            if (position) {
                handleStartDragging(position);
            }
        }
        function handleTouchMove(event: globalThis.TouchEvent) {
            let position = getTouchPosition(event);
            if (position) {
                event.preventDefault();
                handleDragging(position);
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
    }, [divRef, handleDragging, handleEndDragging])

    useEffect(() => {
        window.addEventListener('mouseup', handleEndDragging);
        window.addEventListener('touchend', handleEndDragging);
        window.addEventListener('touchcancel', handleEndDragging);

        return () => {
            window.removeEventListener('mouseup', handleEndDragging);
            window.removeEventListener('touchend', handleEndDragging);
            window.removeEventListener('touchcancel', handleEndDragging);
        };
    }, [handleEndDragging]);

    return <div ref={divRef} style={{
        position: 'relative',
        left: state.offset.x,
        top: state.offset.y,
        zIndex: front ? globalZ + 1 : zIndex,
        cursor: cursorChanged ? 'grab' : undefined,
    }}
        onMouseDown={function (event) {
            handleStartDragging(getMousePosition(event));
        }}
        onMouseMove={function (event) {
            handleDragging(getMousePosition(event));
        }}
        onMouseEnter={function () {
            setTimeout(() => setCursorChanged(true), 1000);
        }}
        onMouseOut={function () {
            setCursorChanged(false);
        }}
    >{children}</div>;
}