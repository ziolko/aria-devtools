import styled from "styled-components";
import React, {useRef} from "react";
import {borderRadius, hoveredBoxShadow, selectedBoxShadow, useFocusable} from "./utils";
import { ComponentProps } from "./utils";
import { observer } from "mobx-react";

const color = "#811515";

const InvalidWrapper = styled.span<{ isHovered: boolean;}>`
  --block-display: inline-block;
  margin: 10px 0;
  border-radius: ${borderRadius};
  white-space: nowrap;

  ${props => props.isHovered && `background: ${color}`};
`;

const InvalidRole = styled.span<{isSelected:boolean}>`
  padding: 0 2px;
  background: ${color};
  line-height: 14px;
  border-radius: ${borderRadius} 0 0 ${borderRadius};
  opacity: 0.8;

  ${InvalidWrapper}:hover > & {
    opacity: 1;
    ${hoveredBoxShadow};
  }

  ${props => props.isSelected && selectedBoxShadow};
`;

const InvalidContent = styled.span<{ isHovered: boolean }>`
  display: inline-block;
  padding: 0 5px;
  background: transparent;
  min-width: 100px;

  border-radius: 0 ${borderRadius} ${borderRadius} 0;
  border: 1px solid ${color};

  :hover {
    background: #555;
  }
`;

export default observer(function Unknown({ node }: ComponentProps) {
  const [isHovered, setHovered] = React.useState(false);
  const [ref, style] = useFocusable(node);
  const roleRef = useRef<HTMLSpanElement>(null);

  return (
    <InvalidWrapper
      ref={ref}
      style={style}
      isHovered={isHovered}
      onClick={(event) => {
        if(!roleRef.current?.isEqualNode(event.target as any)) {
            node.domNode.click()
        }
      }}
    >
      <InvalidRole ref={roleRef}
                        onMouseOver={() => setHovered(true)}
                        onMouseOut={() => setHovered(false)}
                        isSelected={node?.isOpenInSidePanel}>
        ⚠️️ Invalid role: {node.role} (tag: {node.htmlTag})
      </InvalidRole>
      <InvalidContent isHovered={isHovered}>{node.accessibleName}&nbsp;</InvalidContent>
    </InvalidWrapper>
  );
});

