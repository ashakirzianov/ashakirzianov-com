import { PixelPage } from "@/components/PixelPage";
import { useQuery } from "@/utils/query";
import { finished } from "@/sketches/finished";
import Head from "next/head";
import Link from "next/link";
import { PixelButton } from "@/components/Buttons";
import { href } from "@/utils/refs";
import { SketchCard } from "@/components/Cards";
import { SketchMulticollection } from "@/components/SketchCollection";
import { rythm } from "@/sketches/rythm";
import { atoms } from "@/sketches/atoms";
import { posters } from "@/sketches/posters";
import { misc } from "@/sketches/misc";

type Props = {};
export default function AllSketchCollections({ }: Props) {
    let { hue } = useQuery();
    return <PixelPage hue={hue}>
        <Head>
            <title>Все скетчи</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <SketchMulticollection
            collections={[
                rythm,
                atoms,
                posters,
                misc,
            ]}
            hrefForIds={(cid, id) => `/art/${cid}/${id}`}
        />
    </PixelPage>
}