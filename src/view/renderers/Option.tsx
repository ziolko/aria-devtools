import React from "react";
import { renderContext, ComponentProps, useFocusable } from "./utils";
import { trimStart } from "../../AOM/utils";
import { HorizontalBlockTemplate } from "./Heading";
import { observer } from "mobx-react";
import { NodeElement } from "../../AOM/types";
import uniqueBy from "@popperjs/core/lib/utils/uniqueBy";

export default observer(function Option({ node }: ComponentProps) {
  const render = React.useContext(renderContext);
  const [ref, style] = useFocusable(node);

  return (
    <HorizontalBlockTemplate header={`${node.role}`} ref={ref} style={style}>
      {render(trimStart(node.htmlChildren))}
    </HorizontalBlockTemplate>
  );
});
