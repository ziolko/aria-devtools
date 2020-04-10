import React from "react";
import { css } from "styled-components";
import { AOMElement, NodeElement, TextElement } from "../../AOM/types";

export const focusStyle = css`
  box-shadow: 0 0 0 1px #222, 0 0 0 3px yellow;
  z-index: 1;
  position: relative;
`;

export const borderRadius = "5px";

type RenderContext = (element: AOMElement | AOMElement[]) => any;
export type ComponentProps = { node: NodeElement };
export const renderContext = React.createContext<RenderContext>(() => null);

export function isDescendantOf(
  descendant: NonNullable<NodeElement>,
  ascendant: NonNullable<NodeElement>
) {
  let node: AOMElement = descendant;
  while (node != null) {
    if (node === ascendant) {
      return true;
    }
    node = node.htmlParent;
  }

  return false;
}
