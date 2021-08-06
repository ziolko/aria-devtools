import styled from "styled-components";
import React from "react";
import {borderRadius, ComponentProps, hoveredBoxShadow, renderContext, selectedBoxShadow, useFocusable} from "./utils";
import {trimStart} from "../../AOM/utils";
import {observer} from "mobx-react";
import {useOpenSidePanel} from "../side-panel";

const color = "#555";

const ListItemWrapper = styled.div<{ isHovered: boolean }>`
  margin: 10px 0;
  padding: 0 4px 0 0;
  border-radius: ${borderRadius};

  ${props => props.isHovered && `background: ${color}`};

  ::after {
    content: "";
    clear: both;
    display: table;
  }
`;

const Role = styled.div<{isSelected:boolean}>`
  padding: 0 4px;
  line-height: 14px;
  border-radius: ${borderRadius};
  background: ${color};
  opacity: 0.8;
  float: left;
  cursor: pointer;

  ${ListItemWrapper}:hover > & {
    opacity: 1;
    ${hoveredBoxShadow};
  }

  ${props => props.isSelected && selectedBoxShadow};
`;

const ListItemContent = styled.div`
  margin-left: 35px;
`;

export default observer(function ListItem({node}: ComponentProps) {
    const render = React.useContext(renderContext);
    const [isHovered, setHovered] = React.useState(false);
    const [ref, style] = useFocusable(node);
    const openSidePanel = useOpenSidePanel();

    return (
        <ListItemWrapper ref={ref} style={style} isHovered={isHovered}>
            <Role
                onMouseOver={() => setHovered(true)}
                onMouseOut={() => setHovered(false)}
                onClick={() => openSidePanel(node)}
                isSelected={node?.isOpenInSidePanel}>
                {node.attributes.ariaPosInSet}.
            </Role>
            <ListItemContent>{render(trimStart(node.htmlChildren))}</ListItemContent>
        </ListItemWrapper>
    );
});
