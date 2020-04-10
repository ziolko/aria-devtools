import styled from "styled-components";
import React from "react";
import { borderRadius, focusStyle } from "./utils";
import { renderContext, ComponentProps } from "./utils";
import { observer } from "mobx-react";
import {
  AOMElement,
  AriaRole,
  TextElement
} from "../../AOM/types";

const color = "#333377";

const BlockWrapper = styled.div<{
  role: string;
  isHovered: boolean;
  isFocused: boolean;
}>`
  margin: 10px 0;
  position: relative;
  min-height: ${props => props.role.length * 7.5 + 20}px;
  border-radius: ${borderRadius};
  ${props => props.isHovered && `background: ${color}`};
  ${props => props.isFocused && focusStyle};
`;

const BlockMeta = styled.div`
  width: fit-content;
  cursor: pointer;
`;

const BlockRole = styled.div<{ hasHeader: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  writing-mode: vertical-rl;
  background: ${color};
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

const BlockHeader = styled.div`
  width: fit-content;
  background: ${color};
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
    border-left-color: ${color};
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
  isFocused: boolean;
}

export function BlockTemplate({
  role,
  header,
  children,
  isFocused
}: BlockTemplateProps) {
  const [isHovered, setHovered] = React.useState(false);

  return (
    <BlockWrapper
      role={role}
      isHovered={isHovered}
      isFocused={isFocused}
      data-type="block"
    >
      <BlockMeta
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
      >
        <BlockRole hasHeader={!!header}>
          <BlockRoleContent>{role}</BlockRoleContent>
        </BlockRole>
        {header && <BlockHeader>{header}</BlockHeader>}
      </BlockMeta>
      <BlockContent>{children}</BlockContent>
    </BlockWrapper>
  );
}

const needsAccessibleName: AriaRole[] = ["image", "img"];
const needsContent: AriaRole[] = ["presentation", "none", "form", "list"];

function hasContent(item: AOMElement): boolean {
  if (item instanceof TextElement) {
    return item.text.trim() !== "";
  }

  if (!item || item.isHidden) {
    return false;
  }

  if(item.attributes.tabindex >= 0) {
    return true;
  }

  if (needsAccessibleName.includes(item.role)) {
    return item.accessibleName.trim() !== "";
  }

  if (needsContent.includes(item.role)) {
    return item.htmlChildren.some(hasContent);
  }

  return true;
}

export default observer(function({ node }: ComponentProps) {
  const render = React.useContext(renderContext);
  const label = node.hasCustomAccessibleName ? node.accessibleName : undefined;

  if (!hasContent(node)) {
    return null;
  }

  return (
    <BlockTemplate role={node.role} header={label} isFocused={node.isFocused}>
      {render(node.htmlChildren)}
    </BlockTemplate>
  );
});
