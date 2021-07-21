import styled from "styled-components";
import React from "react";
import {borderRadius, ComponentProps, hoveredBoxShadow, selectedBoxShadow, useFocusable} from "./utils";
import {observer} from "mobx-react";
import {useOpenSidePanel} from "../side-panel";

const color = "#8b2900";

const ImageWrapper = styled.span<{ isHovered: boolean }>`
  --block-display: inline-block;

  margin: 15px 0 10px 0;
  padding: 0 4px 0 0;
  border-radius: ${borderRadius};

  ${props => props.isHovered && `background: ${color}`};
`;

const Role = styled.span<{ isSelected: boolean }>`
  display: inline-block;
  margin-right: 3px;
  padding: 0 2px;
  cursor: pointer;
  background: ${color};
  line-height: 14px;
  border-radius: ${borderRadius};
  opacity: 0.8;

  ${ImageWrapper}:hover & {
    ${hoveredBoxShadow};
    opacity: 1;
  }

  ${props => props.isSelected && selectedBoxShadow};
`;

const Content = styled.span`
  cursor: pointer;
  border-radius: 2px;

  :hover {
    background: #555;
  }
`;

export default observer(function Image({node}: ComponentProps) {
    const [isHovered, setHovered] = React.useState(false);
    const [ref, style] = useFocusable(node);
    const openSidePanel = useOpenSidePanel();

    if (node.accessibleName === "") {
        return null;
    }

    return (
        <ImageWrapper ref={ref} style={style} isHovered={isHovered}>
            <Role
                onMouseOver={() => setHovered(true)}
                onMouseOut={() => setHovered(false)}
                onClick={() => openSidePanel(node)}
                isSelected={node.isOpenInSidePanel}
            >
                🖼️
            </Role>
            <Content>{node.accessibleName || "<blank>"}</Content>
        </ImageWrapper>
    );
});
