import { Transformer } from 'unified'
import { Node, Parent, Text } from 'hast'

interface TruncateOptions {
    maxChars: number;
}

interface CurrentChars {
    count: number;
}

function isTextNode(node: Node): node is Text {
    return node.type === 'text'
}

function isParentNode(node: Node): node is Parent {
    return 'children' in node
}

function truncateHTMLTree(
    node: Node,
    maxChars: number,
    currentChars: CurrentChars = { count: 0 }
): Node | null {
    if (currentChars.count >= maxChars) {
        return null
    }

    if (isTextNode(node)) {
        const remainingChars = maxChars - currentChars.count
        const truncatedText = node.value.slice(0, remainingChars)
        currentChars.count += truncatedText.length

        return {
            ...node,
            value: truncatedText,
        } as Text
    }

    if (isParentNode(node)) {
        const truncatedChildren: Node[] = []

        for (const child of node.children) {
            const truncatedChild = truncateHTMLTree(child, maxChars, currentChars)
            if (truncatedChild) {
                truncatedChildren.push(truncatedChild)
            }

            if (currentChars.count >= maxChars) {
                break
            }
        }

        return {
            ...node,
            children: truncatedChildren,
        } as Parent
    }

    return node
}

export function rehypeTruncate({ maxChars }: {
    maxChars?: number;
}): Transformer<Node> {
    return (tree: Node): Node => {
        if (maxChars === undefined) {
            return tree
        }
        const truncatedTree = truncateHTMLTree(tree, maxChars)
        return truncatedTree ?? tree
    }
}
