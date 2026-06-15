import {AOMElement, NodeElement, TextElement} from "./types";
import {getNodeKey} from "./utils";

const ignoredHtmlElements = ["script", "noscript", "style"];

// Follows the flattened (composed) tree, like the browser's accessibility tree:
// a shadow host exposes its shadow root, a <slot> exposes its assigned nodes
// (or its fallback children when nothing is slotted), everything else its light DOM.
function getTraversableChildNodes(node: HTMLElement): Iterable<Node> {
    if (node.shadowRoot != null) {
        return node.shadowRoot.childNodes;
    }

    if (node instanceof HTMLSlotElement) {
        const assigned = node.assignedNodes();
        return assigned.length > 0 ? assigned : node.childNodes;
    }

    return node.childNodes;
}

export default function traverse(htmlNode: Node, traversedNodes = new Map<Node, AOMElement>()): AOMElement {
    if (traversedNodes.has(htmlNode)) {
        return traversedNodes.get(htmlNode);
    }

    if (htmlNode.nodeType === Node.TEXT_NODE) {
        const text = htmlNode.textContent;
        return text ? new TextElement({key: getNodeKey(htmlNode), text, node: htmlNode as HTMLElement}) : null;
    }

    if (htmlNode.nodeType !== Node.ELEMENT_NODE) {
        return null;
    }

    const node = htmlNode as HTMLElement;
    const tagName = node.tagName.toLowerCase();

    if (ignoredHtmlElements.includes(tagName)) {
        return null;
    }

    const result: NodeElement = new NodeElement(node);

    const attributes = result.getRawAttributes();
    Object.keys(attributes).forEach(attribute => {
        // @ts-ignore
        attributes[attribute] = node.getAttribute(attribute)?.trim();
    });

    const properties = result.getRawProperties();
    Object.keys(properties).forEach(property => {
        // @ts-ignore
        properties[property] = node[property];
    });
    // @ts-ignore
    properties.invalid = node.validity ? !node.validity.valid : undefined;

    const children = getTraversableChildNodes(node);

    Array.from(children).forEach(subNode => {
        const child = traverse(subNode, traversedNodes);
        if (child) {
            child.htmlParent = result;
            result.htmlChildren.push(child);
        }
    });

    const before = getComputedStyle(node, ':before').getPropertyValue('content');
    const after = getComputedStyle(node, ':after').getPropertyValue('content');

    // TODO: support complex before/after content e.g counter(listing)

    if (before[0] === '"' && before[before.length - 1] === '"') {
        const textElement = new TextElement({
            key: result.key + "::before",
            text: before.slice(1, -1),
            node: null
        });
        textElement.htmlParent = result;
        result.htmlChildren.unshift(textElement);
    }

    if (after[0] === '"' && after[before.length - 1] === '"') {
        const textElement = new TextElement({
            key: result.key + "::after",
            text: after.slice(1, -1),
            node: null
        });
        textElement.htmlParent = result;
        result.htmlChildren.push(textElement);
    }

    traversedNodes.set(htmlNode, result);
    return result;
}
