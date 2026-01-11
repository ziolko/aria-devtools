import React from "react";
import { HorizontalBlockTemplate } from "./Heading";
import { HeaderTag} from "./Tab";
import { renderContext, ComponentProps } from "./utils";
import { observer } from "mobx-react";

export default observer(function ProgressBar({ node }: ComponentProps) {
  const render = React.useContext(renderContext);
  const value = node.attributes.ariaValueMax
    ? `${node.attributes.ariaValueNow}/${node.attributes.ariaValueMax}`
    : node.attributes.ariaValueNow

  const header = (
      <>
          {node.role}
          <HeaderTag isVisible={!!node.attributes.ariaValueNow}>[{value}]</HeaderTag>
      </>
  );

  return (
    <HorizontalBlockTemplate header={header} node={node}>
      {render(node.children)}
    </HorizontalBlockTemplate>
  );
});
