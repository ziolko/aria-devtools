import { AOMElement, NodeElement, TextElement } from "./types";
import { getNodeKey, isFocused, isHidden, isInline } from "./utils";
import { read } from "@popperjs/core";

const ignoredHtmlElements = ["script", "noscript", "style"];

export default function traverse(htmlNode: Node, traversedNodes = new Map<Node, AOMElement>()): AOMElement {
  if (traversedNodes.has(htmlNode)) {
    return traversedNodes.get(htmlNode);
  }

  if (htmlNode.nodeType === Node.TEXT_NODE) {
    const text = htmlNode.textContent;
    return text ? new TextElement({ key: getNodeKey(htmlNode), text }) : null;
  }

  if (htmlNode.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const node = htmlNode as HTMLElement;
  const tagName = node.tagName.toLowerCase();

  if (ignoredHtmlElements.includes(tagName)) {
    return null;
  }

  const result: NodeElement = new NodeElement({
    key: getNodeKey(node),
    htmlTag: tagName,
    isHidden: isHidden(node),
    isFocused: isFocused(node),
    isInline: isInline(node)
  });

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

  node.childNodes.forEach(subNOde => {
    const child = traverse(subNOde, traversedNodes);
    if (child) {
      child.htmlParent = result;
      result.htmlChildren.push(child);
    }
  });

  traversedNodes.set(htmlNode, result);
  return result;
}
