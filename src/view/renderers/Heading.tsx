import styled from "styled-components";
import React, { MouseEvent } from "react";
import { borderRadius, useFocusable } from "./utils";
import { renderContext, ComponentProps } from "./utils";
import { trimStart } from "../../AOM/utils";
import { observer } from "mobx-react";

const HeadingWrapper = styled.div<{ isHovered: boolean; color: string, onClick?: any }>`
  margin: 15px 0 10px 0;
  border-radius: ${borderRadius};
  ${props => props.isHovered && `background: ${props.color}`};
`;

const Role = styled.div<{ color: string}>`
  display: inline-block;
  text-transform: uppercase;
  background: ${props => props.color};
  border-radius: ${borderRadius};
  margin: 0 10px 0 0;
  padding: 0 5px;
  border: 1px solid transparent;
  opacity: 0.8;
  ${props => props.onClick && `cursor: pointer`};

  ${HeadingWrapper}:hover & {
    border-color: white;
    opacity: 1;
  }
`;

export interface HorizontalBlockTemplateProps {
  header: React.ReactChild;
  children: any;
  style?: object;
  color?: string;
  onClick?: (e: MouseEvent) => void
}

export const HorizontalBlockTemplate = React.forwardRef(
  ({ header, children, style, onClick, color = "#ab8900" }: HorizontalBlockTemplateProps, ref: React.Ref<any>) => {
    const [isHovered, setHovered] = React.useState(false);

    return (
      <HeadingWrapper isHovered={isHovered} style={style} ref={ref} color={color} >
        <Role color={color} onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)} onClick={onClick}>
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
