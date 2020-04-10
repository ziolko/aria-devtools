import styled from "styled-components";
import React from "react";
import { focusStyle, borderRadius } from "./utils";
import { trimStart } from "../../AOM/utils";
import { renderContext, ComponentProps } from "./utils";
import { observer } from "mobx-react";

const color = "#555";

const ListItemWrapper = styled.div<{ isFocused: boolean; isHovered: boolean }>`
  margin: 10px 0;
  padding: 0 4px 0 0;
  border-radius: ${borderRadius};

  ${props => props.isFocused && focusStyle};
  ${props => props.isHovered && `background: ${color}`};
  
  ::after {
    content: "";
    clear: both;
    display: table;
  }
`;

const Role = styled.div`
  padding: 0 4px;
  cursor: pointer;
  line-height: 14px;
  border-radius: ${borderRadius};
  border: 1px solid transparent;
  background: ${color};
  opacity: 0.8;
  float: left;

  ${ListItemWrapper}:hover > & {
    border-color: white;
    opacity: 1;
  }
`;

const ListItemContent = styled.div`
  margin-left: 35px;
`;

export default observer(function ListItem({ node }: ComponentProps) {
  const render = React.useContext(renderContext);
  const [isHovered, setHovered] = React.useState(false);

  return (
    <ListItemWrapper isFocused={node.isFocused} isHovered={isHovered}>
      <Role
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
      >
        {node.attributes.ariaPosInSet}.
      </Role>
      <ListItemContent>{render(trimStart(node.htmlChildren))}</ListItemContent>
    </ListItemWrapper>
  );
});
