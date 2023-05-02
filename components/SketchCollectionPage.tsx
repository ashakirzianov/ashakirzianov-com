import { useQuery } from "@/utils/query";
import { AllSketchesButton, HomeButton } from "./Buttons";
import { SketchCollectionBlock } from "./SketchCollection";
import { PixelPage } from "./PixelPage";

export function SketchCollectionPage({ ...rest }: Parameters<typeof SketchCollectionBlock>[0]) {
    let { hue } = useQuery();
    // TODO: add title and description
    return <PixelPage hue={hue}>
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