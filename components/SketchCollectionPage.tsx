import { AllSketchesButton, HomeButton } from "./Buttons";
import { SketchCollectionBlock } from "./SketchCollection";
import { PixelPage } from "./PixelPage";

export function SketchCollectionPage({ ...rest }: Parameters<typeof SketchCollectionBlock>[0]) {
    // TODO: add title and description
    return <PixelPage>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--padding)',
        }}>
            <SketchCollectionBlock {...rest} />
            <AllSketchesButton />
            <HomeButton />
        </div>
    </PixelPage>
}