import { AllSketchesButton, HomeButton } from "./Buttons";
import { SketchCollectionBlock } from "./SketchCollection";
import { PixelPage } from "./PixelPage";

export function SketchCollectionPage({ ...rest }: Parameters<typeof SketchCollectionBlock>[0]) {
    let { collection: { meta } } = rest;
    return <PixelPage
        title={meta.title}
        description={meta.description ?? `Серия скетчей: ${meta.title}`}
    >
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--padding)',
            padding: 'var(--padding)',
        }}>
            <SketchCollectionBlock {...rest} />
            <footer style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--padding)',
                padding: 'var(--padding)',
            }}>
                <AllSketchesButton />
                <HomeButton />
            </footer >
        </div>
    </PixelPage>
}