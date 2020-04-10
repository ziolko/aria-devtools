import React from "react";
import { renderContext, ComponentProps } from "./utils";
import { trimStart } from "../../AOM/utils";
import { HorizontalBlockTemplate } from "./Heading";
import { observer } from "mobx-react";
import { NodeElement } from "../../AOM/types";
import uniqueBy from "@popperjs/core/lib/utils/uniqueBy";

export const getFocusStyle = (node: NodeElement) : any => {
  if (node.isFocused) {
    return {
      position: "relative",
      boxShadow: "0 0 0 1px #222, 0 0 0 3px yellow",
      zIndex: 1
    };
  }

  if (node.relations.ariaActiveDescendantOf.some(x => x.isFocused)) {
    return {
      position: "relative",
      boxShadow: "0 0 0 1px #222, 0 0 0 3px green",
      zIndex: 1
    };
  }

  return {};
};

export default observer(function Option({ node }: ComponentProps) {
  const render = React.useContext(renderContext);

  return (
    <HorizontalBlockTemplate
      header={`${node.role}`}
      style={getFocusStyle(node)}
    >
      {render(trimStart(node.htmlChildren))}
    </HorizontalBlockTemplate>
  );
});
