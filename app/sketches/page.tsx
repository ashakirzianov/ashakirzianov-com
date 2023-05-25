import { HomeButton } from "@/components/Buttons"
import { AllCollections } from "./client"
import { PixelPage } from "@/components/PixelPage"
import { buildMetadata } from "@/utils/metadata"

export const metadata = buildMetadata({
    title: "Все скетчи",
    description: "Страница со всеми картинками",
})

export default function AllSketches() {
    return <PixelPage>
        <div className="flex flex-col items-center p-stn">
            <AllCollections />
            <footer className="pt-l pb-stn">
                <HomeButton />
            </footer>
        </div>
    </PixelPage>
};