import React from "react";
import { AOMElement, NodeElement, TextElement } from "../../AOM/types";
import scrollIntoView from "scroll-into-view";

export const borderRadius = "5px";

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
        scrollIntoView(ref.current, {
          time: 200
        });
      }
      // ref.current?.scrollIntoView({ block: "nearest" });
    }
  }, [isFocused, isActiveDescendant, hasActiveDescendant]);

  return [ref, style];
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
