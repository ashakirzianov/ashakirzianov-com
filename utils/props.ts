export type PageProps = {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export type GenerateMetadataProps = PageProps