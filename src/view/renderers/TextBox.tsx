import styled, { css } from "styled-components";
import React from "react";
import { borderRadius, useFocusable } from "./utils";
import { ComponentProps } from "./utils";
import { observer } from "mobx-react";
import { HorizontalBlockTemplate } from "./Heading";

export const TextBoxContent = styled.span<{ multiline?: boolean; invalid?: boolean }>`
  display: block;
  margin-top: 5px;
  padding: 3px 5px;
  background: transparent;
  border: 1px solid ${props => (props.invalid ? "#c33" : "#aaa")};
  width: fit-content;
  min-width: 200px;

  border-radius: ${borderRadius};
  white-space: pre-wrap;
  ${props => props.multiline && "min-height: 40px; width: auto;"};

  cursor: pointer;
  :hover {
    background: #555;
  }
`;

const HeaderPart = styled.span`
  cursor: pointer;
  :hover {
    background: #555;
  }
`;

const ValidityIcon = styled.span<{ invalid: boolean }>`
  display: inline-block;
  transform-origin: center center;
  transition: transform 0.3s ease-in;
  transform: ${props => (props.invalid ? `rotate(180deg) translateY(-1px)` : `rotate(0) translate(0)`)};

  ::before {
    content: "👍";
  }
`;

export default observer(function TextBox({ node }: ComponentProps) {
  const [ref, style] = useFocusable(node);
  let value = node.attributes.htmlValue;

  if (node.htmlTag === "input" && node.attributes.htmlType === "password") {
    value = "*".repeat(value?.length ?? 0);
  }

  let spinButtonRange = "";
  if(node.role === "spinbutton") {
      value = node.attributes.ariaValueText || node.attributes.ariaValueNow?.toString()
      const parts = [
          node.attributes.ariaValueMin != null && `min: ${node.attributes.ariaValueMin}`,
          node.attributes.ariaValueMax != null && `max: ${node.attributes.ariaValueMax}`
      ].filter(Boolean)

      if(parts.length > 0) spinButtonRange = `(${parts.join(', ')})`;
  }

  return (
    <HorizontalBlockTemplate header={node.role ?? `<${node.htmlTag}>`} ref={ref} node={node}>
      {node.hasCustomAccessibleName && (
        <>
          <HeaderPart>{node.accessibleName}</HeaderPart>{" "}
        </>
      )}
        {spinButtonRange}
      <HeaderPart>
        {node.attributes.ariaRequired && "⭐"} <ValidityIcon invalid={!!node.attributes.ariaInvalid} />
      </HeaderPart>
      <TextBoxContent
        multiline={node.attributes.ariaMultiline}
        invalid={node.attributes.ariaInvalid}
        onClick={() => node.domNode.focus()}
        style={style}
      >
        {value}&nbsp;
      </TextBoxContent>
    </HorizontalBlockTemplate>
  );
});
