import React from "react";
import { BlockTemplate } from "./Block";
import { renderContext, ComponentProps } from "./utils";
import { observer } from "mobx-react";

export default observer(function RadioGroup({ node }: ComponentProps) {
  const render = React.useContext(renderContext);
  const radioItems = node.htmlChildren.filter(x => x?.role === "radio");
  const radioItemCount = radioItems.length;

  const length = `${radioItemCount} item${radioItemCount === 1 ? "" : "s"}`;

  const header = node.hasCustomAccessibleName
    ? `${node.accessibleName} - ${length}`
    : length;

  return (
    <BlockTemplate role={node.role} header={header} node={node}>
      {render(node.children)}
    </BlockTemplate>
  );
});
