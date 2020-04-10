import styled from "styled-components";
import React from "react";
import { renderContext, ComponentProps } from "./utils";
import { observer } from "mobx-react";

const ParagraphWrapper = styled.div`
  display: var(--block-display);
  margin: 10px 0;
`;

export default observer(function Paragraph({ node }: ComponentProps) {
  const render = React.useContext(renderContext);
  return (
    <ParagraphWrapper data-role="paragraph">
      {render(node.htmlChildren)}
    </ParagraphWrapper>
  );
});
