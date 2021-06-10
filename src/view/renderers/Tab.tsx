import React from "react";
import styled from "styled-components";
import {HorizontalBlockTemplate} from "./Heading";
import {ComponentProps, renderContext, useFocusable} from "./utils";
import {observer} from "mobx-react";
import {NodeElement} from "../../AOM/types";
import {trimStart} from "../../AOM/utils";

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

export const ClickableHorizontalBlock = observer(function ClickableHorizontalBlock({ node, header }: ClickableHorizontalBlockProps) {
    const [ref, style] = useFocusable(node);

    return (
        <HorizontalBlockTemplate
            ref={ref}
            style={style}
            header={header}
            color="#333377"
            onClick={() => node.domNode.click()}>
            <TabContent onClick={() => node.domNode.click()}>{node.accessibleName}</TabContent>
        </HorizontalBlockTemplate>
    );
});

export default observer(function Tab({node}: ComponentProps) {
    const header = (
        <>
            {node.role}
            {node.attributes.ariaSelected ? <span style={{textTransform: 'none'}}> [selected]</span> : null}
        </>
    );

    return <ClickableHorizontalBlock node={node} header={header} />
});
