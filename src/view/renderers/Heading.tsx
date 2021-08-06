import styled from "styled-components";
import React from "react";
import {borderRadius, ComponentProps, hoveredBoxShadow, renderContext, selectedBoxShadow, useFocusable} from "./utils";
import {trimStart} from "../../AOM/utils";
import {observer} from "mobx-react";
import {useOpenSidePanel} from "../side-panel";
import {NodeElement} from "../../AOM/types";

const HeadingWrapper = styled.div<{ isHovered: boolean; color: string, onClick?: any }>`
  display: var(--block-display);
  margin: 15px 0 10px 0;
  border-radius: ${borderRadius};
  ${props => props.isHovered && `background: ${props.color}`};
`;

const Role = styled.div<{ color: string, isSelected: boolean }>`
  display: inline-block;
  text-transform: uppercase;
  background: ${props => props.color};
  border-radius: ${borderRadius};
  margin: 0 10px 0 0;
  padding: 0 5px;
  opacity: 0.8;
  ${props => props.onClick && `cursor: pointer`};
  ${props => props.isSelected && selectedBoxShadow};

  ${HeadingWrapper}:hover & { {
    ${hoveredBoxShadow};
    opacity: 1;
  }
`;

export interface HorizontalBlockTemplateProps {
    node: NodeElement;
    header: React.ReactChild;
    children: any;
    style?: object;
    color?: string;
}

export const HorizontalBlockTemplate = observer(React.forwardRef(
    ({header, children, style, node, color = "#ab8900"}: HorizontalBlockTemplateProps, ref: React.Ref<any>) => {
        const [isHovered, setHovered] = React.useState(false);
        const openSidePanel = useOpenSidePanel();

        return (
            <HeadingWrapper isHovered={isHovered} style={style} ref={ref} color={color}>
                <Role color={color} onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)}
                      onClick={() => openSidePanel(node)}
                      isSelected={node?.isOpenInSidePanel}
                >
                    {header}
                </Role>
                {children}
            </HeadingWrapper>
        );
    }
));

export default observer(function Heading({node}: ComponentProps) {
    const render = React.useContext(renderContext);
    const [ref, style] = useFocusable(node);

    return (
        <HorizontalBlockTemplate header={`${node.role} ${node.attributes.ariaLevel ?? ""}`} ref={ref} style={style}
                                 node={node}>
            {render(trimStart(node.htmlChildren))}
        </HorizontalBlockTemplate>
    );
});
