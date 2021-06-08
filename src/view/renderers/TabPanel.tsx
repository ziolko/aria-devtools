import React from "react";
import {renderContext, ComponentProps, useFocusable} from "./utils";
import { observer } from "mobx-react";
import {BlockTemplate} from "./Block";

export default observer(function TabPanel({ node }: ComponentProps) {
  const [ref, style] = useFocusable(node);
  const render = React.useContext(renderContext);

  const forceHovered = node.relations.ariaControlledBy.some(x => x.isFocused)

  return (
    <BlockTemplate ref={ref} style={style} role={node.role} background={forceHovered ? '#3b3b4d' : 'null'}>
      {render(node.children)}
    </BlockTemplate>
  );
});
