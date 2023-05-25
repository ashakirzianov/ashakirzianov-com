import { HomeButton } from "@/components/Buttons"
import { AllCollections } from "./client"
import { PixelPage } from "@/components/Pages"

export default function AllSketches() {
    return <PixelPage
        title="Все скетчи"
        description="Страница со всеми картинками"
    >
        <div className="flex flex-col items-center p-stn">
            <AllCollections />
            <footer className="pt-l pb-stn">
                <HomeButton />
            </footer>
        </div>
    </PixelPage>
};