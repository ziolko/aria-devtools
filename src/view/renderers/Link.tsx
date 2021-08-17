import styled from "styled-components";
import React from "react";
import {
    borderRadius,
    ComponentProps,
    hoveredBoxShadow,
    IssuesBadge,
    renderContext,
    selectedBoxShadow,
    useFocusable
} from "./utils";
import {observer} from "mobx-react";
import {useOpenSidePanel} from "../side-panel";
import {trimStart} from "../../AOM/utils";
import {getAccessibleNameOf} from "../../AOM/types";

const LinkWrapper = styled.span<{ isHovered: boolean }>`
  margin: 10px 0;
  padding: 0 4px 0 0;
  border-radius: ${borderRadius};
  --block-display: inline-block;

  ${props => props.isHovered && `background: #548a33`};
`;

const Role = styled.span<{ isSelected: boolean }>`
  position: relative;
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

    const children = trimStart(node.children) ?? [];

    function getContent() {
        if (node.hasCustomAccessibleName) {
            return (node.accessibleName || "<blank>")
        }
        const contentText = getAccessibleNameOf(children).trim();
        return (contentText ? render(children) : node.attributes.htmlHref) ?? "<blank>";
    }

    return (
        <LinkWrapper ref={ref} style={style} isHovered={isHovered}>
            <Role onMouseOver={() => setHovered(true)}
                  onMouseOut={() => setHovered(false)}
                  onClick={(event) => openSidePanel(node, event)}
                  isSelected={node?.isOpenInSidePanel}>
                🔗
                <IssuesBadge node={node}/>
            </Role>
            <LinkContent onClick={(event) => !event.defaultPrevented && node.domNode.click()}>
                {getContent()}
            </LinkContent>
        </LinkWrapper>
    );
});
