import styled from "styled-components";
import React from "react";
import { borderRadius, useFocusable } from "./utils";
import { ComponentProps } from "./utils";
import { observer } from "mobx-react";

const LinkWrapper = styled.span<{ isHovered: boolean }>`
  margin: 10px 0;
  padding: 0 4px 0 0;
  border-radius: ${borderRadius};
  --block-display: inline-block;

  ${props => props.isHovered && `background: #548a33`};
`;

const Role = styled.span`
  margin-right: 3px;
  padding: 0 2px;
  cursor: pointer;
  background: #548a33;
  line-height: 14px;
  border-radius: ${borderRadius};
  border: 1px solid transparent;
  opacity: 0.8;

  ${LinkWrapper}:hover & {
    border-color: white;
    opacity: 1;
  }
`;

const LinkContent = styled.span`
  text-decoration: underline;
  cursor: pointer;

  :hover {
    background: #555;
  }
`;

export default observer(function Link({ node }: ComponentProps) {
  const [isHovered, setHovered] = React.useState(false);
  const [ref, style] = useFocusable(node);

  return (
    <LinkWrapper ref={ref} style={style} isHovered={isHovered}>
      <Role
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
      >
        🔗
      </Role>
      <LinkContent>{node.accessibleName || "<blank>"}</LinkContent>
    </LinkWrapper>
  );
});
