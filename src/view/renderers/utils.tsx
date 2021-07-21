import React from "react";
import { AOMElement, NodeElement } from "../../AOM/types";
import scroll from "scroll";

const scrollPadding = 100;
export const borderRadius = "5px";
export const hoveredBoxShadow = `box-shadow: 0 0 0 1px white;`;
export const selectedBoxShadow = `box-shadow: 0 0 0 3px #eee !important;`

type RenderContext = (element: AOMElement | AOMElement[]) => any;
export type ComponentProps = { node: NodeElement };
export const renderContext = React.createContext<RenderContext>(() => null);

export function isDescendantOf(descendant: NonNullable<NodeElement>, ascendant: NonNullable<NodeElement>) {
  let node: AOMElement = descendant;
  while (node != null) {
    if (node === ascendant) {
      return true;
    }
    node = node.htmlParent;
  }

  return false;
}

export function useFocusable(node: NonNullable<NodeElement>): [React.Ref<any>, object] {
  const ref = React.useRef<Element>(null);

  const isFocused = node.isFocused;
  const hasActiveDescendant = node.relations.ariaActiveDescendants.length > 0;
  const isActiveDescendant = node.relations.ariaActiveDescendantOf.some(x => x.isFocused);

  const style = React.useMemo(() => {
    if ((isFocused && !hasActiveDescendant) || isActiveDescendant) {
      return {
        position: "relative",
        boxShadow: `0 0 0 1px #222, 0 0 0 3px yellow`,
        zIndex: 1
      };
    } else {
      return {};
    }
  }, [isFocused, hasActiveDescendant, isActiveDescendant]);

  React.useEffect(() => {
    if (isActiveDescendant || (isFocused && !hasActiveDescendant)) {
      if (ref.current) {
        scrollToElement(ref.current);
      }
    }
  }, [isFocused, isActiveDescendant, hasActiveDescendant]);

  return [ref, style];
}

export function scrollToElement(element: Element) {
  const scrollParent = element.getRootNode()?.getElementById("aria-dev-tools-scroll-parent");
  if (!scrollParent) {
    return;
  }

  const viewport = scrollParent.getBoundingClientRect();
  const el = element.getBoundingClientRect();

  // The element is larger than the viewport - scroll top of the element to the top of the viewport
  if (el.height + scrollPadding > viewport.height) {
    scroll.top(scrollParent, scrollParent.scrollTop + el.top - 10);
    return;
  }

  // The element starts above the top of the viewport - scroll top of the element to the top of the viewport
  if (el.top - scrollPadding < viewport.top) {
    scroll.top(scrollParent, scrollParent.scrollTop + el.top - scrollPadding);
    return;
  }

  // The element ends below the bottom of the viewport - scroll bottom of the element to the bottom of the viewport
  if (el.bottom + scrollPadding > viewport.bottom) {
    scroll.top(scrollParent, scrollParent.scrollTop + el.bottom - viewport.bottom + scrollPadding);
    return;
  }
}

export function getHeader(...els: (string | undefined)[]) {
  const result = [];
  for (const x of els) {
    if (!!x) {
      result.push(x);
    }
  }
  return result.join(" ");
}
