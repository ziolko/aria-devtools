import React from "react";
import { renderContext, ComponentProps, useFocusable } from "./utils";
import { trimStart } from "../../AOM/utils";
import { HorizontalBlockTemplate } from "./Heading";
import { observer } from "mobx-react";
import { NodeElement } from "../../AOM/types";
import uniqueBy from "@popperjs/core/lib/utils/uniqueBy";
import styled from "styled-components";

const CheckboxIcon = styled.span<{
  checked: boolean;
}>`
  margin-right: 8px;
  width: 14px;
  height: 12px;
  cursor: pointer;
  display: inline-flex;
  border: 1px solid #fff;
  align-items: center;
  justify-content: center;

  ::before {
    opacity: ${props => (props.checked ? 1 : 0)};
    content: "✔️";
  }
`;

export default observer(function Option({ node }: ComponentProps) {
  const render = React.useContext(renderContext);
  const [ref, style] = useFocusable(node);

  return (
    <HorizontalBlockTemplate header={`${node.role}`} ref={ref} style={style} node={node}>
      {node.attributes.ariaSelected === true && <CheckboxIcon checked={true} />}
      {node.attributes.ariaSelected === false && <CheckboxIcon checked={false} />}
      {render(trimStart(node.htmlChildren))}
    </HorizontalBlockTemplate>
  );
});
