'use client'
import { PixelPage } from '@/components/PixelPage'
import { notFound } from 'next/navigation'
import { SketchCollectionBlock } from '@/components/SketchCollection'
import { AllSketchesButton, HomeButton } from '@/components/Buttons'
import { collections } from '@/sketches'

export function CollectionPage({ collectionId, hue }: {
    collectionId: string,
    hue: number | undefined,
}) {
    const collection = collections.find(c => c.id === collectionId)
    if (!collection) {
        return notFound()
    }
    return <PixelPage hue={hue}>
        <div className="flex flex-col items-center gap-stn p-stn">
            <SketchCollectionBlock collection={collection} linkToCollection={false} />
            <footer className="flex flex-col items-center gap-stn p-stn">
                <AllSketchesButton hue={hue} />
                <HomeButton hue={hue} />
            </footer >
        </div>
    </PixelPage>
}