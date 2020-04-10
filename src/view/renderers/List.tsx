import React from "react";
import { BlockTemplate } from "./Block";
import { renderContext, ComponentProps } from "./utils";
import { observer } from "mobx-react";

export default observer(function List({ node }: ComponentProps) {
  const render = React.useContext(renderContext);
  const listItems = node.htmlChildren.filter(x => x?.role === "listitem");

  const length = `${listItems.length} item${listItems.length === 1 ? "" : "s"}`;

  const header = node.hasCustomAccessibleName
    ? `${node.accessibleName} - ${length}`
    : length;

  return (
    <BlockTemplate role={node.role} header={header}>
      {render(node.htmlChildren)}
    </BlockTemplate>
  );
});
