import React from "react";
import styled from "styled-components";
import { BlockTemplate } from "./Block";
import { renderContext, ComponentProps } from "./utils";
import { observer } from "mobx-react";

const FigureWrapper = styled.div`
  white-space: pre-wrap;
  border: 1px solid white;
  padding: 5px;
  width: auto;
  background: #555;
  overflow: auto;
`;

export default observer(function Figure({ node }: ComponentProps) {
  const render = React.useContext(renderContext);
  return (
    <BlockTemplate role={node.role}>
      <FigureWrapper data-type="figure">
        {render(node.children)}
      </FigureWrapper>
    </BlockTemplate>
  );
});
