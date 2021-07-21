import styled from "styled-components";
import React from "react";
import {borderRadius, ComponentProps, hoveredBoxShadow, renderContext, selectedBoxShadow, useFocusable} from "./utils";
import {observer} from "mobx-react";
import {useOpenSidePanel} from "../side-panel";
import {trimStart} from "../../AOM/utils";

const LinkWrapper = styled.span<{ isHovered: boolean }>`
  margin: 10px 0;
  padding: 0 4px 0 0;
  border-radius: ${borderRadius};
  --block-display: inline-block;

  ${props => props.isHovered && `background: #548a33`};
`;

const Role = styled.span<{ isSelected: boolean }>`
  margin-right: 3px;
  padding: 0 2px;
  cursor: pointer;
  background: #548a33;
  line-height: 14px;
  border-radius: ${borderRadius};
  opacity: 0.8;

  ${LinkWrapper}:hover & {
    opacity: 1;
    ${hoveredBoxShadow};
  }

  ${props => props.isSelected && selectedBoxShadow};
`;

const LinkContent = styled.span`
  text-decoration: underline;
  cursor: pointer;

  :hover {
    background: #555;
  }
`;

export default observer(function Link({node}: ComponentProps) {
    const render = React.useContext(renderContext);
    const [isHovered, setHovered] = React.useState(false);
    const [ref, style] = useFocusable(node);
    const openSidePanel = useOpenSidePanel();

    return (
        <LinkWrapper ref={ref} style={style} isHovered={isHovered}>
            <Role onMouseOver={() => setHovered(true)}
                  onMouseOut={() => setHovered(false)}
                  onClick={() => openSidePanel(node)}
                  isSelected={node.isOpenInSidePanel}>
                🔗
            </Role>
            <LinkContent
                onClick={() => node.domNode.click()}>{node.hasCustomAccessibleName ? node.accessibleName || "<blank>" : render(trimStart(node.htmlChildren))}</LinkContent>
        </LinkWrapper>
    );
});
