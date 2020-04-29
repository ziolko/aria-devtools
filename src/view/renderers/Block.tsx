import styled from "styled-components";
import React from "react";
import { borderRadius, useFocusable } from "./utils";
import { renderContext, ComponentProps } from "./utils";
import { observer } from "mobx-react";
import {
  AOMElement,
  AriaRole,
  NodeElement,
  TextElement
} from "../../AOM/types";

const BlockWrapper = styled.div<{
  role: string;
  color: string;
  isHovered: boolean;
}>`
  margin: 10px 0;
  position: relative;
  min-height: ${props => props.role.length * 7.5 + 20}px;
  border-radius: ${borderRadius};
  ${props => props.isHovered && `background: ${props.color}`};
`;

const BlockMeta = styled.div`
  width: fit-content;
  cursor: pointer;
`;

const BlockRole = styled.div<{ hasHeader: boolean; color: string }>`
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
  border-top-right-radius: ${props => (props.hasHeader ? "0px" : borderRadius)};
  border: 1px solid transparent;
  opacity: 0.8;

  ${BlockWrapper}:hover > ${BlockMeta} > & {
    border-color: white;
    opacity: 1;
  }
`;

const BlockRoleContent = styled.span`
  position: sticky;
  top: 10px;
`;

const BlockHeader = styled.div<{ color: string }>`
  width: fit-content;
  background: ${props => props.color};
  padding: 0 10px;
  line-height: 20px;
  border-radius: 0 ${borderRadius} ${borderRadius} 0;
  border: 1px solid transparent;
  position: relative;
  margin-left: 21px;
  opacity: 0.8;

  ::first-letter {
    text-transform: uppercase;
  }

  ${BlockWrapper}:hover > ${BlockMeta} > & {
    border-color: white;
    border-left-color: ${props => props.color};
    opacity: 1;

    // Fix the weird gap in border;
    ::before {
      content: "";
      position: absolute;
      left: -2px;
      width: 10px;
      top: -1px;
      height: 1px;
      background: white;
    }
  }
`;

const BlockContent = styled.div`
  margin-left: 32px;
  ::before,
  ::after {
    content: "";
    display: block;
    margin-top: 10px;
  }
`;

export interface BlockTemplateProps {
  role: string | null;
  header?: string;
  children: any;
  style?: object;
  color?: string;
}

export const BlockTemplate = React.forwardRef(function BlockTemplate(
  { role, header, children, style, color }: BlockTemplateProps,
  ref: React.Ref<HTMLDivElement>
) {
  color = color ?? "#333377";

  const [isHovered, setHovered] = React.useState(false);

  return (
    <BlockWrapper
      ref={ref}
      style={style}
      color={color}
      role={role ?? ""}
      isHovered={isHovered}
    >
      <BlockMeta
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
      >
        <BlockRole hasHeader={!!header} color={color}>
          <BlockRoleContent>{role}</BlockRoleContent>
        </BlockRole>
        {header && <BlockHeader color={color}>{header}</BlockHeader>}
      </BlockMeta>
      <BlockContent>{children}</BlockContent>
    </BlockWrapper>
  );
});

export default observer(function({ node }: ComponentProps) {
  const [ref, style] = useFocusable(node);
  const render = React.useContext(renderContext);

  const label = node.hasCustomAccessibleName ? node.accessibleName : undefined;

  // if (!node.hasContent) {
  //   return null;
  // }

  return (
    <BlockTemplate ref={ref} style={style} role={node.role} header={label}>
      {render(node.children)}
    </BlockTemplate>
  );
});
