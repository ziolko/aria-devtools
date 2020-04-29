import styled from "styled-components";
import React from "react";
import { borderRadius, useFocusable } from "./utils";
import { ComponentProps } from "./utils";
import { observer } from "mobx-react";

const color = "#8b2900";

const ImageWrapper = styled.span<{ isHovered: boolean }>`
  --block-display: inline-block;

  margin: 15px 0 10px 0;
  padding: 0 4px 0 0;
  border-radius: ${borderRadius};

  ${props => props.isHovered && `background: ${color}`};
`;

const Role = styled.span`
  display: inline-block;
  margin-right: 3px;
  padding: 0 2px;
  cursor: pointer;
  background: ${color};
  line-height: 14px;
  border-radius: ${borderRadius};
  border: 1px solid transparent;
  opacity: 0.8;

  ${ImageWrapper}:hover & {
    border-color: white;
    opacity: 1;
  }
`;

const Content = styled.span`
  cursor: pointer;
  border-radius: 2px;
  :hover {
    background: #555;
  }
`;

export default observer(function Image({ node }: ComponentProps) {
  const [isHovered, setHovered] = React.useState(false);
  const [ref, style] = useFocusable(node);

  if (node.accessibleName === "") {
    return null;
  }

  return (
    <ImageWrapper ref={ref} style={style} isHovered={isHovered}>
      <Role
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
      >
        🖼️
      </Role>
      <Content>{node.accessibleName || "<blank>"}</Content>
    </ImageWrapper>
  );
});
