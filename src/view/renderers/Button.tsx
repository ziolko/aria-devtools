import styled from "styled-components";
import React from "react";
import { borderRadius, renderContext, useFocusable } from "./utils";
import { ComponentProps } from "./utils";
import { observer } from "mobx-react";
import { BlockTemplate } from "./Block";

const color = "#aaa";

const SimpleButtonWrapper = styled.span<{ isHovered: boolean; isDisabled: boolean }>`
  --block-display: inline-block;
  margin: 10px 0;
  border-radius: ${borderRadius};
  white-space: nowrap;

  ${props => props.isHovered && `background: ${color}`};
  ${props => props.isDisabled && `color: #777`};
`;

const SimpleButtonRole = styled.span`
  padding: 0 2px;
  cursor: pointer;
  background: ${color};
  line-height: 14px;
  border-radius: ${borderRadius} 0 0 ${borderRadius};
  border: 1px solid transparent;
  opacity: 0.8;

  ${SimpleButtonWrapper}:hover & {
    border-color: white;
    opacity: 1;
  }
`;

const SimpleButtonContent = styled.span<{ isHovered: boolean }>`
  display: inline-block;
  padding: 0 5px;
  background: transparent;
  min-width: 100px;
  cursor: pointer;

  border-radius: 0 ${borderRadius} ${borderRadius} 0;
  border: ${props => (props.isHovered ? `1px solid ${color}` : ` 1px dashed #555`)};

  :hover {
    background: #555;
  }
`;

const SimpleButton = observer(function SimpleButton({ node }: ComponentProps) {
  const [isHovered, setHovered] = React.useState(false);
  const [ref, style] = useFocusable(node);

  return (
    <SimpleButtonWrapper ref={ref} style={style} isHovered={isHovered} isDisabled={!!node.attributes.disabled}>
      <SimpleButtonRole onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)}>
        🖱️
      </SimpleButtonRole>
      <SimpleButtonContent isHovered={isHovered}>{node.accessibleName}&nbsp;</SimpleButtonContent>
    </SimpleButtonWrapper>
  );
});

const ExpansibleButton = observer(function ExpansibleButton({ node }: ComponentProps) {
  const render = React.useContext(renderContext);

  return (
    <BlockTemplate role={node.role} header={node.attributes.ariaExpanded ? "[expanded]" : "[collapsed]"}>
      <SimpleButton node={node} />
      {render(node.relations.ariaOwns)}
    </BlockTemplate>
  );
});

export default observer(function Button({ node }: ComponentProps) {
  const isExpansible = node.attributes.ariaExpanded != null;
  return isExpansible ? <ExpansibleButton node={node} /> : <SimpleButton node={node} />;
});
