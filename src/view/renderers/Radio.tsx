import styled from "styled-components";
import React from "react";
import { borderRadius, useFocusable } from "./utils";
import { ComponentProps } from "./utils";
import { observer } from "mobx-react";

const color = "#aaa";

export const RadioButtonWrapper = styled.span<{
  isHovered: boolean;
}>`
  margin: 10px 0;
  padding: 0 3px;
  border-radius: ${borderRadius};
  ${props => props.isHovered && `background: ${color}`};
`;

const RadioIcon = styled.span<{ checked: boolean }>`
  display: inline-block;
  cursor: pointer;
  padding: 4px 10px 2px 0;
  vertical-align: middle;

  ::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border: 3px solid #ccc;
    border-radius: 50%;

    ${props => props.checked && `background: #ccc`};
  }
`;

const RadioLabel = styled.span`
  cursor: pointer;
  :hover {
    background: #555;
  }
`;

export default observer(function Radio({ node }: ComponentProps) {
  const [isHovered, setHovered] = React.useState(false);
  const [ref, style] = useFocusable(node);

  return (
    <RadioButtonWrapper isHovered={isHovered} ref={ref} style={style}>
      <RadioIcon
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        checked={!!node.attributes.htmlChecked}
      />
      <RadioLabel>{node.accessibleName}</RadioLabel>
    </RadioButtonWrapper>
  );
});
