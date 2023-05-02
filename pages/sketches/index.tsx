import { PixelPage } from "@/components/PixelPage";
import Head from "next/head";
import { href } from "@/utils/refs";
import { SketchMulticollection } from "@/components/SketchCollection";
import { rythm } from "@/sketches/rythm";
import { atoms } from "@/sketches/atoms";
import { posters } from "@/sketches/posters";
import { misc } from "@/sketches/misc";

type Props = {};
export default function AllSketchCollections({ }: Props) {
    return <PixelPage
        title="Все скетчи"
        description="Страница со всеми картинками"
    >
        <SketchMulticollection
            collections={[
                rythm,
                atoms,
                posters,
                misc,
            ]}
            hrefForIds={(collection, id) => href('sketch', { id, collection })}
        />
    </PixelPage>
}