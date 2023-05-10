import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { rehypeTruncate } from './truncate'
import { rehypeAddIdToH1 } from './addIdToH1'

export async function extractHtml(content: string, id: string, maxChars?: number): Promise<string> {
    const htmlFile = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeTruncate, { maxChars })
        .use(rehypeStringify)
        .process(content)

    return String(htmlFile)
}
