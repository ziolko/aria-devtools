import styled from "styled-components";
import React from "react";
import { focusStyle, borderRadius } from "./utils";
import { renderContext, ComponentProps } from "./utils";
import { observer } from "mobx-react";

const color = "#aaa";

const ButtonWrapper = styled.span<{ isFocused: boolean; isHovered: boolean }>`
  --block-display: inline-block;
  margin: 10px 0;
  border-radius: ${borderRadius};
  white-space: nowrap;

  ${props => props.isFocused && focusStyle};
  ${props => props.isHovered && `background: ${color}`};
`;

const Role = styled.span`
  padding: 0 2px;
  cursor: pointer;
  background: ${color};
  line-height: 14px;
  border-radius: ${borderRadius} 0 0 ${borderRadius};
  border: 1px solid transparent;
  opacity: 0.8;

  ${ButtonWrapper}:hover & {
    border-color: white;
    opacity: 1;
  }
`;

const ButtonContent = styled.span<{ isHovered: boolean }>`
  display: inline-block;
  padding: 0 5px;
  background: transparent;
  min-width: 100px;
  cursor: pointer;

  border-radius: 0 ${borderRadius} ${borderRadius} 0;
  border: ${props =>
    props.isHovered ? `1px solid ${color}` : ` 1px dashed #555`};

  :hover {
    background: #555;
  }
`;

export default observer(function Button({ node }: ComponentProps) {
  const [isHovered, setHovered] = React.useState(false);


  return (
    <ButtonWrapper isFocused={node.isFocused} isHovered={isHovered}>
      <Role
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
      >
        🖱️
      </Role>
      <ButtonContent isHovered={isHovered}>
        {node.accessibleName}&nbsp;
      </ButtonContent>
    </ButtonWrapper>
  );
});
