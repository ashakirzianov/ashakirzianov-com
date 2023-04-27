import { Transformer } from 'unified';
import { Node, Parent, Element } from 'hast';

export function rehypeAddIdToH1({ id }: { id: string }): Transformer {
    return (tree: Node): Node => {
        addIdToFirstH1(tree, id);
        return tree;
    };
}

function isElementNode(node: Node): node is Element {
    return node.type === 'element';
}

function isParentNode(node: Node): node is Parent {
    return 'children' in node;
}

function addIdToFirstH1(node: Node, id: string): boolean {
    if (isElementNode(node) && node.tagName === 'h1') {
        node.properties = { ...node.properties, id };
        return true;
    }

    if (isParentNode(node)) {
        for (const child of node.children) {
            const addedId = addIdToFirstH1(child, id);
            if (addedId) {
                return true;
            }
        }
    }

    return false;
}
