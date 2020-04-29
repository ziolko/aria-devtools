import React from "react";
import { BlockTemplate } from "./Block";
import { renderContext, ComponentProps } from "./utils";
import { observer } from "mobx-react";

export default observer(function Cell({ node }: ComponentProps) {
  const render = React.useContext(renderContext);

  let header = node.attributes.headers?.map(x => x.accessibleName).join(", ") || undefined;

  if (node.attributes.ariaRowIndex) {
    header += ` - row ${node.attributes.ariaRowIndex}`;
    if (node.attributes.ariaRowSpan && node.attributes.ariaRowSpan > 1) {
      header += `-${node.attributes.ariaRowIndex + node.attributes.ariaRowSpan - 1}`;
    }
  }

  if (node.attributes.ariaColIndex) {
    header += `, column ${node.attributes.ariaColIndex}`;
    if (node.attributes.ariaColSpan && node.attributes.ariaColSpan > 1) {
      header += `-${node.attributes.ariaColIndex + node.attributes.ariaColSpan - 1})`;
    }
  }

  return (
    <BlockTemplate role={node.role} header={header}>
      {render(node.children)}
    </BlockTemplate>
  );
});
