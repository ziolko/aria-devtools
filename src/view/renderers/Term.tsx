import React from "react";
import { renderContext, ComponentProps } from "./utils";
import { trimStart } from "../../AOM/utils";
import { HorizontalBlockTemplate } from "./Heading";
import { observer } from "mobx-react";

export default observer(function Term({ node }: ComponentProps) {
  const render = React.useContext(renderContext);

  return (
    <HorizontalBlockTemplate header={`${node.role}`} node={node}>
      {render(trimStart(node.htmlChildren))}
    </HorizontalBlockTemplate>
  );
});
