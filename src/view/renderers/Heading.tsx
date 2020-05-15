import styled from "styled-components";
import React from "react";
import { borderRadius, useFocusable } from "./utils";
import { renderContext, ComponentProps } from "./utils";
import { trimStart } from "../../AOM/utils";
import { observer } from "mobx-react";

const HeadingWrapper = styled.div<{ isHovered: boolean; color: string }>`
  margin: 15px 0 10px 0;
  border-radius: ${borderRadius};
  ${props => props.isHovered && `background: ${props.color}`};
`;

const Role = styled.div<{ color: string }>`
  display: inline-block;
  text-transform: uppercase;
  background: ${props => props.color};
  border-radius: ${borderRadius};
  margin: 0 10px 0 0;
  padding: 0 5px;
  border: 1px solid transparent;
  opacity: 0.8;

  ${HeadingWrapper}:hover & {
    border-color: white;
    opacity: 1;
  }
`;

export interface HorizontalBlockTemplateProps {
  header: string;
  children: any;
  style?: object;
  color?: string;
}

export const HorizontalBlockTemplate = React.forwardRef(
  ({ header, children, style, color = "#ab8900" }: HorizontalBlockTemplateProps, ref: React.Ref<any>) => {
    const [isHovered, setHovered] = React.useState(false);

    return (
      <HeadingWrapper isHovered={isHovered} style={style} ref={ref} color={color}>
        <Role color={color} onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)}>
          {header}
        </Role>
        {children}
      </HeadingWrapper>
    );
  }
);

export default observer(function Heading({ node }: ComponentProps) {
  const render = React.useContext(renderContext);
  const [ref, style] = useFocusable(node);

  return (
    <HorizontalBlockTemplate header={`${node.role} ${node.attributes.ariaLevel ?? ""}`} ref={ref} style={style}>
      {render(trimStart(node.htmlChildren))}
    </HorizontalBlockTemplate>
  );
});
