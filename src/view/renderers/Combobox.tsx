import React from "react";
import { renderContext, useFocusable } from "./utils";
import { ComponentProps } from "./utils";
import { observer } from "mobx-react";
import TextBox, { TextBoxContent } from "./TextBox";
import { BlockTemplate } from "./Block";

export default observer(function Combobox({ node }: ComponentProps) {
  const [ref, style] = useFocusable(node);
  const render = React.useContext(renderContext);

  const header = node.hasCustomAccessibleName ? node.accessibleName : undefined;

  if (node.htmlTag === "input") {
    return (
      <BlockTemplate role={node.role} header={header} ref={ref}>
        <TextBoxContent key={node.key} style={style}>
          {node.attributes.htmlValue}&nbsp;
        </TextBoxContent>
      </BlockTemplate>
    );
  }

  if (node.htmlTag === "select") {
    return (
      <BlockTemplate role={node.role} header={header} ref={ref}>
        <TextBoxContent key={node.key} style={style}>
          {node.attributes.htmlValue}&nbsp;
        </TextBoxContent>
      </BlockTemplate>
    );
  }

  return (
    <BlockTemplate role={node.role} header={header}>
      {render(node.children)}
    </BlockTemplate>
  );
});
