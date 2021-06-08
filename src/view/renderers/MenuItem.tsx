import styled from "styled-components";
import React from "react";
import { borderRadius, useFocusable } from "./utils";
import { renderContext, ComponentProps } from "./utils";
import { trimStart } from "../../AOM/utils";
import { observer } from "mobx-react";
import { HorizontalBlockTemplate } from "./Heading";
import {ClickableHorizontalBlock} from "./Tab";

export default observer(function MenuItem({ node }: ComponentProps) {
  const render = React.useContext(renderContext);
  const [ref, style] = useFocusable(node);

  return <ClickableHorizontalBlock node={node} header={`${node.role} ${node.attributes.ariaLevel ?? ""}`} />

  return (
    <HorizontalBlockTemplate
      header={`${node.role} ${node.attributes.ariaLevel ?? ""}`}
      ref={ref}
      style={style}
      color={"#337"}
    >
      {node.hasCustomAccessibleName ? node.accessibleName : render(trimStart(node.htmlChildren))}
    </HorizontalBlockTemplate>
  );
});
