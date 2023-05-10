import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { promisify } from 'util'
import { extractTextSnippet } from './extractSnippet'
import { extractHtml } from './extractHtml'

export type TextPost = {
    id: string,
    html: string,
    textSnippet: string,
    title?: string,
    translation?: {
        en?: string,
        ru?: string,
    },
    original?: {
        en?: string,
        ru?: string,
    },
    language?: string,
    date?: string,
    description?: string,
};
export type TextPostMap = {
    [id: string]: TextPost,
};

// Gets all previews for all texts
export async function getAllPreviews(language?: string): Promise<TextPostMap> {
    let result: TextPostMap = {}
    let ids = await getAllTextIds()
    for (let id of ids) {
        let preview = await getTextForId({ id, maxChars: 1000 })
        if (preview && (language === undefined || preview.language === language)) {
            result[id] = preview
        }
    }

    return result
}

export async function getTextForId({ id, maxChars }: {
    id: string, maxChars?: number
}) {
    let fileName = path.join(getTextsDirectory(), `${id}.md`)
    return getText(fileName, maxChars)
}

export async function getAllTextIds() {
    let files = await getTextFiles(getTextsDirectory())
    return files.map(fileName => path.basename(fileName).replace('.md', ''))
}

async function getText(fileName: string, maxChars?: number): Promise<TextPost | undefined> {
    try {
        let id = path.basename(fileName).replace('.md', '')
        let file = await promisify(fs.readFile)(fileName, 'utf8')
        let matterFile = matter(file)

        let html = await extractHtml(matterFile.content, id, maxChars)

        let textSnippet = extractTextSnippet(matterFile.content)


        return {
            id,
            html,
            date: matterFile.data.date,
            title: matterFile.data.title,
            translation: {
                en: matterFile.data['translation-en'] ?? null,
                ru: matterFile.data['translation-ru'] ?? null,
            },
            original: {
                en: matterFile.data['original-en'] ?? null,
                ru: matterFile.data['original-ru'] ?? null,
            },
            language: matterFile.data.language,
            textSnippet,
        }
    } catch (e) {
        console.log(`Error reading text file ${fileName}: ${e}`)
        return undefined
    }
}

async function getTextFiles(textsDirectory: string) {
    const fileNames = await promisify(fs.readdir)(textsDirectory)
    return fileNames
        .filter(fn => fn.endsWith('.md'))
        .map(fn => path.join(textsDirectory, fn))
}

function getTextsDirectory() {
    return path.join(process.cwd(), 'texts')
}