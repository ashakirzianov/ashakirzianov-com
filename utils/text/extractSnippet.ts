import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { visit, Visitor } from 'unist-util-visit'
import type { Node, Parent, Literal } from 'unist'
import type { Root } from 'mdast'

export function extractTextSnippet(content: string, maxLength: number = 160): string {
    const ast: Root = unified().use(remarkParse).parse(content) as Root

    let plainText = ''

    const visitor: Visitor<Node> = (node, _index, parent) => {
        if (node.type === 'text' && (!parent || (parent as Parent).type !== 'heading')) {
            plainText += (node as Literal).value + ' '
        }
    }

    visit(ast, visitor)

    return plainText.trim().substring(0, maxLength)
}
