import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { promisify } from 'util';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { rehypeTruncate } from './truncate';
import { rehypeAddIdToH1 } from './addIdToH1';

export type TextPost = {
    id: string,
    html: string,
    title?: string,
    date?: string,
};

export async function getAllTexts() {
    let ids = await getAllTextIds();
    let objects = await Promise.all(ids.map(getTextForId));
    return objects.filter((o): o is TextPost => o !== undefined);
}

export async function getTextForId(id: string) {
    let fileName = path.join(getTextsDirectory(), `${id}.md`);
    return getText(fileName);
}

export async function getAllTextIds() {
    let files = await getTextFiles(getTextsDirectory());
    return files.map(fileName => path.basename(fileName).replace('.md', ''))
}

async function getText(fileName: string, maxChars?: number): Promise<TextPost | undefined> {
    try {
        let id = path.basename(fileName).replace('.md', '');
        let file = await promisify(fs.readFile)(fileName, 'utf8');
        let matterFile = matter(file);

        const htmlFile = await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeTruncate, { maxChars })
            .use(rehypeAddIdToH1, { id })
            .use(rehypeStringify)
            .process(matterFile.content);

        return {
            id,
            html: String(htmlFile),
            date: matterFile.data.date,
            title: matterFile.data.title,
        };
    } catch {
        return undefined;
    }
}

async function getTextFiles(textsDirectory: string) {
    const fileNames = await promisify(fs.readdir)(textsDirectory);
    return fileNames
        .filter(fn => fn.endsWith('.md'))
        .map(fn => path.join(textsDirectory, fn));
}

function getTextsDirectory() {
    return path.join(process.cwd(), 'texts');
}