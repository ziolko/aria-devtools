import styled, {css} from "styled-components";
import React from "react";
import {borderRadius, ComponentProps, hoveredBoxShadow, renderContext, selectedBoxShadow, useFocusable} from "./utils";
import {observer} from "mobx-react";
import {useOpenSidePanel} from "../side-panel";
import {NodeElement} from "../../AOM/types";

const BlockWrapper = styled.div<{
    role: string;
    color: string;
    isHovered: boolean;
    background?: string;
}>`
  margin: 10px 0;
  position: relative;
  min-height: ${props => props.role.length * 7.5 + 20}px;
  border-radius: ${borderRadius};
  background: ${props => props.background ?? 'transparent'};
  ${props => props.isHovered && `background: ${props.color}`};
`;


const BlockMeta = styled.div<{isSelected: boolean}>`
  width: fit-content;
  opacity: 0.8;

  ${BlockWrapper}:hover > & {
    opacity: 1;
  }
`;

const BlockRoleBorder = styled.div<{isSelected: boolean}>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 20px;
  border-radius: ${borderRadius};

  ${BlockWrapper}:hover > ${BlockMeta} > & {
    ${hoveredBoxShadow};
  }
  
  ${props => props.isSelected && selectedBoxShadow};
`

const BlockRole = styled.div<{ color: string; isSelected: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  writing-mode: vertical-rl;
  background: ${props => props.color};
  padding: 10px 0;
  line-height: 20px;
  text-transform: uppercase;
  border-radius: ${borderRadius};
  word-break: keep-all;
  cursor: pointer;
`;

const BlockRoleContent = styled.span`
  position: sticky;
  top: 10px;
`;

const BlockHeader = styled.div<{ color: string; isSelected: boolean }>`
  width: fit-content;
  background: ${props => props.color};
  padding: 0 10px 0 30px;
  line-height: 20px;
  border-radius:  ${borderRadius};
  position: relative;
  cursor: pointer;
  
  ${BlockWrapper}:hover > ${BlockMeta} > & {
    ${hoveredBoxShadow};
  }
  ${props => props.isSelected && selectedBoxShadow};

  ::first-letter {
    text-transform: uppercase;
  }

  
`;

const BlockContent = styled.div`
  margin-left: 32px;
  word-break: break-word;

  ::before,
  ::after {
    content: "";
    display: block;
    margin-top: 10px;
  }
`;

export interface BlockTemplateProps {
    node: NodeElement;
    role: string | null;
    header?: string;
    children: any;
    style?: object;
    className?: string;
    color?: string;
    background?: string;
}

export const BlockTemplate = observer(React.forwardRef(function BlockTemplate(
    {node, role, header, children, style, className, color, background}: BlockTemplateProps,
    ref: React.Ref<HTMLDivElement>
) {
    color = color ?? "#333377";

    const openSidePanel = useOpenSidePanel();
    const [isHovered, setHovered] = React.useState(false);

    return (
        <BlockWrapper ref={ref} className={className} style={style} color={color} role={role ?? ""}
                      isHovered={isHovered} background={background}>
            <BlockMeta onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)} isSelected={node?.isOpenInSidePanel}>
                <BlockRoleBorder isSelected={node?.isOpenInSidePanel} />
                {header && <BlockHeader color={color} onClick={() => openSidePanel(node)}
                                        isSelected={node?.isOpenInSidePanel}>{header}</BlockHeader>}
                <BlockRole color={color} onClick={() => openSidePanel(node)}
                           isSelected={node?.isOpenInSidePanel}>
                    <BlockRoleContent>{role}</BlockRoleContent>
                </BlockRole>
            </BlockMeta>
            <BlockContent>{children}</BlockContent>
        </BlockWrapper>
    );
}));

export default observer(function ({node}: ComponentProps) {
    const [ref, style] = useFocusable(node);
    const render = React.useContext(renderContext);

    const label = node.hasCustomAccessibleName ? node.accessibleName : undefined;

    if (!node.hasContent) {
        return null;
    }

    return (
        <BlockTemplate ref={ref} style={style} role={node.role} header={label} node={node}>
            {render(node.children)}
        </BlockTemplate>
    );
});
