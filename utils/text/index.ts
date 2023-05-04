import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { promisify } from 'util'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { rehypeTruncate } from './truncate'
import { rehypeAddIdToH1 } from './addIdToH1'
import { toString } from 'mdast-util-to-string'

export type TextPost = {
    id: string,
    html: string,
    textSnippet: string,
    title?: string,
    date?: string,
    description?: string,
};
export type TextPostMap = {
    [id: string]: TextPost,
};

export async function getAllPreviews(): Promise<TextPostMap> {
    let result: TextPostMap = {}
    let ids = await getAllTextIds()
    for (let id of ids) {
        let preview = await getTextForId({ id, maxChars: 1000 })
        if (preview) {
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

        const htmlFile = await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeTruncate, { maxChars })
            .use(rehypeAddIdToH1, { id })
            .use(rehypeStringify)
            .process(matterFile.content)
        let html = String(htmlFile)

        let textSnippet = toString(await unified()
            .use(remarkParse)
            .parse(matterFile.content)).substring(0, 160)


        return {
            id,
            html,
            date: matterFile.data.date,
            title: matterFile.data.title,
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