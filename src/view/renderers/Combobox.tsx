import React from "react";
import { renderContext, useFocusable } from "./utils";
import { ComponentProps } from "./utils";
import { observer } from "mobx-react";
import { TextBoxContent } from "./TextBox";
import { BlockTemplate } from "./Block";
import { NodeElement } from "../../AOM/types";

export default observer(function Combobox({ node }: ComponentProps) {
  const [ref, style] = useFocusable(node);
  const render = React.useContext(renderContext);

  const headers = [];
  if (node.hasCustomAccessibleName) {
    headers.push(node.accessibleName);
  }
  headers.push(node.attributes.ariaExpanded ? "[expanded]" : "[collapsed]");
  const header = headers.join(" ");

  if (node.htmlTag === "input") {
    return (
      <BlockTemplate role={node.role} header={header} ref={ref}>
        <TextBoxContent key={node.key} style={style} onClick={() => node.domNode.focus()}>
          {node.attributes.htmlValue}&nbsp;
        </TextBoxContent>

        {render(node.relations.ariaOwns)}
      </BlockTemplate>
    );
  }

  if (node.htmlTag === "select") {
    const options = node.htmlChildren.filter(x => x instanceof NodeElement && x.htmlTag === "option") as NodeElement[];
    const currentOption = options.find(x => x.attributes.htmlValue === node.attributes.htmlValue);

    return (
      <BlockTemplate role={node.role} header={header} ref={ref}>
        <TextBoxContent key={node.key} style={style}>
          {currentOption?.accessibleName}&nbsp;
        </TextBoxContent>
        {/*<BlockTemplate role={"listbox"}>{render(options)}</BlockTemplate>*/}
      </BlockTemplate>
    );
  }

  return (
    <BlockTemplate role={node.role} header={header}>
      {render(node.children)}
    </BlockTemplate>
  );
});
