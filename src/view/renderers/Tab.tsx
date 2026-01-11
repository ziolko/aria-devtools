import React from "react";
import styled from "styled-components";
import {HorizontalBlockTemplate} from "./Heading";
import {ComponentProps, useFocusable} from "./utils";
import {observer} from "mobx-react";
import {NodeElement} from "../../AOM/types";

const TabContent = styled.div`
  display: inline-block;
  cursor: pointer;

  :hover {
    background: #555;
  }
`

interface ClickableHorizontalBlockProps {
    header: React.ReactChild
    node: NodeElement
}

export const ClickableHorizontalBlock = observer(function ClickableHorizontalBlock({
                                                                                       node,
                                                                                       header
                                                                                   }: ClickableHorizontalBlockProps) {
    const [ref, style] = useFocusable(node);

    return (
        <HorizontalBlockTemplate
            ref={ref}
            style={style}
            header={header}
            color="#333377"
            node={node}>
            <TabContent onClick={() => node.domNode.click()}>{node.accessibleName}</TabContent>
        </HorizontalBlockTemplate>
    );
});

export function HeaderTag({isVisible, children}: { isVisible: boolean | undefined, children: React.ReactNode }) {
    return isVisible ? <span style={{textTransform: 'none'}}> {children}</span> : null
}

export default observer(function Tab({node}: ComponentProps) {
    const header = (
        <>
            {node.role}
            <HeaderTag isVisible={node.attributes.ariaSelected}>[selected]</HeaderTag>
        </>
    );

    return <ClickableHorizontalBlock node={node} header={header}/>
});
