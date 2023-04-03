import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { promisify } from 'util';
import { remark } from 'remark';
import html from 'remark-html';
import { parseISO } from 'date-fns';

export type TextPost = {
    id: string,
    date?: string,
    html: string,
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

async function getText(fileName: string): Promise<TextPost | undefined> {
    try {
        let id = path.basename(fileName).replace('.md', '');
        let fileContents = await promisify(fs.readFile)(fileName, 'utf8');
        let matterResult = matter(fileContents);
        let htmlData = await remark()
            .use(html)
            .process(matterResult.content);

        return {
            id,
            html: htmlData.toString(),
            date: matterResult.data.date,
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