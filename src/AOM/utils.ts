import { v4 as uuidv4 } from "uuid";
import { AOMElement, NodeElement, TextElement } from "./types";

export function isHidden(el: HTMLElement): boolean {
  const { display, visibility } = window.getComputedStyle(el);
  return (
    !!el.getAttribute("hidden") ||
    el.getAttribute("aria-hidden") === "true" ||
    display === "none" ||
    visibility === "hidden" ||
    el.getAttribute("type") === "hidden"
  );
}

export function isFocused(el: HTMLElement) {
  return document.activeElement === el && el !== document.body;
}

export function isInline(el: HTMLElement) {
  const { display } = window.getComputedStyle(el);
  return display === "inline";
}

const nodeKeys = new WeakMap<Node, string>();
export function getNodeKey(node: Node): string {
  if (!nodeKeys.has(node)) {
    nodeKeys.set(node, uuidv4());
  }

  return nodeKeys.get(node) as string;
}

export function trimString(str: string, maxLength: number) {
  if (!str) return "";
  if (str.length > maxLength - 3) {
    return str.substr(0, maxLength - 3) + "...";
  }
  return str;
}

export function trimStart(el: AOMElement[]) {
  const result: AOMElement[] = [];

  for (let i = 0; i < el.length; i++) {
    const isText = el[i]!.role === "text";
    const textElement = el[i] as TextElement;

    if (isText && textElement.text.trimStart() !== "") {
      const trimmedTextElement = new TextElement({
        node: textElement.domNode,
        key: textElement.key,
        text: textElement.text.trimStart()
      });
      trimmedTextElement.htmlParent = textElement.htmlParent;

      result.push(trimmedTextElement);
      result.push(...el.slice(i + 1));
      return result;
    }

    if (!isText) {
      return el.slice(i);
    }
  }

  return null;
}

export const findDescendantInput = (nodes: AOMElement[]): NodeElement | null => {
  for (const node of nodes) {
    if (node instanceof NodeElement) {
      if (node.htmlTag === "input") {
        return node;
      }

      const descendantInput = findDescendantInput(node.htmlChildren);
      if (descendantInput) {
        return descendantInput;
      }
    }
  }
  return null;
};

const tagsWithNullRoleMapping = [
  "audio",
  "abbr",
  "b",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "del",
  "details",
  "div",
  "dl",
  "em",
  "embed",
  "figcaption",
  "hgroup",
  "i",
  "iframe",
  "ins",
  "kbd",
  "label",
  "legend",
  "link",
  "map",
  "mark",
  "math",
  "meta",
  "meter",
  "nobr",
  "noscript",
  "object",
  "p",
  "param",
  "picture",
  "pre",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "slot",
  "small",
  "source",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "template",
  "time",
  "title",
  "track",
  "u",
  "var",
  "video",
  "wbr"
];

export function hasEmptyRoleMapping(htmlTag: string) {
  return htmlTag.includes("-") || tagsWithNullRoleMapping.includes(htmlTag);
}

const sectioningTags = [
  "main",
  "article",
  "aside",
  "nav",
  "section",
  "blockquote",
  "details",
  "dialog",
  "fieldset",
  "figure",
  "td"
];

export function isRootLandmark(node: NodeElement) {
  for (let asc = node.htmlParent; asc != null; asc = asc.htmlParent) {
    if (asc.htmlTag === "body") return true;
    if (sectioningTags.includes(asc.htmlTag)) return false;
  }
  return true;
}

export function findAncestor(node: NodeElement | null | undefined, predicate: (node: NodeElement) => boolean) {
  while ((node = node?.htmlParent) != null) {
    if (predicate(node)) {
      return node;
    }
  }

  return null;
}

export function findDescendants(node: NodeElement | null | undefined, predicate: (node: NodeElement) => boolean) {
  const result: NodeElement[] = [];

  node?.htmlChildren.forEach(child => {
    if (child instanceof TextElement) {
      return;
    }

    if (predicate(child)) {
      result.push(child);
      return;
    }

    result.push(...findDescendants(child, predicate));
  });

  return result;
}
