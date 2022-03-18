import styled from "styled-components";
import React from "react";
import { borderRadius, useClick, useFocusable } from "./utils";
import { ComponentProps } from "./utils";
import { observer } from "mobx-react";

const color = "#aaa";

export const CheckboxWrapper = styled.span<{
  isHovered: boolean;
}>`
  margin: 10px 0;
  padding: 0 3px;
  border-radius: ${borderRadius};
  ${props => props.isHovered && `background: ${color}`};
`;

const CheckboxIcon = styled.span<{
  checked: "true" | "false" | "mixed" | undefined;
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
    opacity: ${props => (props.checked === "true" ? 1 : 0)};
    content: "✔️";
  }
`;

const RadioLabel = styled.span`
  cursor: pointer;
  :hover {
    background: #555;
  }
`;

export default observer(function Checkbox({ node }: ComponentProps) {
  const [isHovered, setHovered] = React.useState(false);
  const [ref, style] = useFocusable(node);
  const onClick = useClick(node);

  return (
    <CheckboxWrapper
      isHovered={isHovered}
      ref={ref}
      style={style}
      onClick={onClick}>
      <CheckboxIcon
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        checked={node.attributes.ariaChecked}
      />
      <RadioLabel>{node.accessibleName}</RadioLabel>
    </CheckboxWrapper>
  );
});
