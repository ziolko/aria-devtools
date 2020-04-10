import React from "react";
import Block from "./Block";
import { renderContext, ComponentProps } from "./utils";
import { observer } from "mobx-react";

export default observer(function Document({ node }: ComponentProps) {
  const render = React.useContext(renderContext);
  const children = render(node.htmlChildren);

  return node.htmlParent ? <Block node={node} /> : children;
});
