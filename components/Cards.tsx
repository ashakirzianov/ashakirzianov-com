import { Scene } from "@/sketcher";
import { href } from "@/utils/refs";
import { useSketcherPlayer } from "@/utils/sketcher";
import { TextPost } from "@/utils/text";
import Link from "next/link";
import { ReactNode, useCallback, useEffect, useRef } from "react";

export function SketchCard({ sketch, pixelated }: {
    sketch: Scene<any>,
    pixelated: boolean,
}) {
    let u = 20;
    let { node, setPlay } = useSketcherPlayer({
        scene: sketch, period: 40,
        dimensions: pixelated ? [3 * u, 4 * u] : undefined,
    });
    return <Card
        onVisibilityChanged={setPlay}
    >
        {node}
    </Card>
}

export function TextCard({ text }: {
    text: TextPost,
}) {
    return <Card>
        <div className="container">
            <div className="post noselect" dangerouslySetInnerHTML={{ __html: text.html }} />
            <style jsx>{`
      .container {
        display: flex;
        justify-content: center;
        align-items: start;
        height: 100%;
        width: 100%;
        background-color: var(--paper-light);
        color: var(--foreground-light);
        word-break: break-word;
      }
      .post {
        overflow: hidden;
        font-size: .4em;
        max-height: var(--card-text-height);
        padding: 3em 5%;
        width: 100%;
      }
      `}</style>
            <style>{`
      h1 {
          margin-top: .5em;
          margin-bottom: 1em;
          line-height: 1em;
      }
      p {
          text-indent: 1em;
          line-height: 1em;
          margin-bottom: 1em;
      }
    `}</style>
        </div>
    </Card>;
}

export type HighlightKind = 'stories' | 'posters';
export function AboutCard({ hue, onHover }: {
    hue: number,
    onHover?: (target?: HighlightKind) => void,
}) {
    return <Card>
        <div className="content noselect" unselectable="on">
            —Привет! Меня зовут <span>Анҗан</span>. Я пишу <AboutLink href={href('text', { hue })} highlight="stories" onHover={onHover}>рассказы</AboutLink> и генерирую <AboutLink href={href('sketch', { hue })} highlight="posters" onHover={onHover}>плакаты и формы</AboutLink>.
            <p>&nbsp;</p>
            — Что? Кто ты такой и <AboutLink href={href('about', { hue })}>что это за буква җ?</AboutLink>

            <style jsx>{`
    .content {
      color: var(--foreground-light);
      background-color: var(--paper-light);
      text-indent: 1em;
      line-height: 1.2em;
      font-size: 0.95em;
      padding: 10%;
      width: 100%;
      height: 100%;
    }
    span {
      color: var(--foreground-light);
    }
    `}</style>
        </div>
    </Card >;
}

function AboutLink({ children, href, highlight, onHover }: {
    href: string,
    children?: ReactNode,
    highlight?: HighlightKind,
    onHover?: (target?: HighlightKind) => void,
}) {
    return <Link href={href} style={{
        color: 'skyblue',
    }}
        onMouseOver={function () {
            if (onHover && highlight) {
                onHover(highlight)
            }
        }}
        onMouseLeave={function () {
            if (onHover) {
                onHover(undefined);
            }
        }}
        onMouseOut={function () {
            if (onHover) {
                onHover(undefined);
            }
        }}
    >
        {children}
    </Link>;
}


function Card({
    children,
    onVisibilityChanged,
}: {
    children?: ReactNode;
    onVisibilityChanged?: (isVisible: boolean) => void;
}) {
    const THRESHOLD = 0.1;
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!onVisibilityChanged || !cardRef.current) return;
        let ref = cardRef.current;

        let lastVisibility: boolean | null = null;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const isVisible = entry.intersectionRatio >= THRESHOLD;
                    if (isVisible !== lastVisibility) {
                        onVisibilityChanged(isVisible);
                        lastVisibility = isVisible;
                    }
                });
            },
            { threshold: THRESHOLD }
        );

        observer.observe(ref);

        // Call the onVisibilityChanged function immediately after setting up the observer
        const rect = ref.getBoundingClientRect();
        const isVisible =
            (rect.top <= window.innerHeight && rect.top + rect.height * THRESHOLD >= 0) ||
            (rect.bottom >= 0 && rect.bottom - rect.height * THRESHOLD <= window.innerHeight);
        if (isVisible !== lastVisibility) {
            onVisibilityChanged(isVisible);
            lastVisibility = isVisible;
        }

        return () => {
            observer.unobserve(ref);
        };
    }, [onVisibilityChanged]);

    return (
        <div className="pixel-shadow" ref={cardRef}>
            <div className="card-frame pixel-corners">{children}</div>
        </div>
    );
}