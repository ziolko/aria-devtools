import React from "react";
import {
  renderContext,
  ComponentProps,
  focusStyle,
  borderRadius,
  isDescendantOf
} from "./utils";
import { observer } from "mobx-react";
import { BlockTemplate } from "./Block";
import { NodeElement } from "../../AOM/types";
import styled from "styled-components";

export const Collapsed = styled.span`
  display: inline-block;
  background: #353535;
  color: #888;
  padding: 2px;
  border-radius: ${borderRadius};
  cursor: pointer;
  margin-right: 5px;

  ::before {
    content: "[…]";
  }

  :hover {
    color: #eee;
    background: #555;
  }
`;

const NewLine = styled.div`
  margin: 10px 0 5px 0;
`;

function isLabelDescendantOrSiblingOfLabelledNode(label: NodeElement) {
  const siblings = label.htmlParent?.htmlChildren;

  if (!siblings) {
    return false;
  }

  const index = siblings.indexOf(label);

  for (const labelled of label.relations.labelOf) {
    if (isDescendantOf(label, labelled)) return true;
    if (siblings[index - 1] === labelled) return true;
    if (siblings[index + 1] === labelled) return true;
  }

  return false;
}

export default observer(function Null({ node }: ComponentProps) {
  const render = React.useContext(renderContext);
  const content = render(node.htmlChildren);

  if (typeof content === "string" && content.trim() === "") {
    return null;
  }

  if (node.isFocused || (node.attributes.tabIndex as number) >= 0) {
    return (
      <BlockTemplate role={"no role"} isFocused={node.isFocused}>
        {content}
      </BlockTemplate>
    );
  }

  if (isLabelDescendantOrSiblingOfLabelledNode(node)) {
    return <Collapsed />;
  }

  if (node.htmlTag === "p") {
    return <p>{content}</p>;
  }

  return (
    <div data-html-tag={node.htmlTag} style={{ display: "contents" }}>
      {node.htmlTag === "label" && <NewLine />}
      {content}
    </div>
  );
});
