import React from "react";
import { BlockTemplate } from "./Block";
import { renderContext, ComponentProps } from "./utils";
import { observer } from "mobx-react";

export default observer(function List({ node }: ComponentProps) {
  const render = React.useContext(renderContext);
  function recurseForListItems(total: number, node: any) {
      if (node?.role === "listitem") {
        return total + 1;
      } else if (node?.role === "group") {
        return total + node.htmlChildren?.reduce(recurseForListItems, 0);
      }
      return total;
  }
  const listItemCount = node.htmlChildren.reduce(recurseForListItems, 0);

  const length = `${listItemCount} item${listItemCount === 1 ? "" : "s"}`;

  const header = node.hasCustomAccessibleName
    ? `${node.accessibleName} - ${length}`
    : length;

  return (
    <BlockTemplate role={node.role} header={header} node={node}>
      {render(node.children)}
    </BlockTemplate>
  );
});
