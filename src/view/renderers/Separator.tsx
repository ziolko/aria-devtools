import styled from "styled-components";
import React from "react";
import { renderContext, ComponentProps } from "./utils";
import { observer } from "mobx-react";

const SeparatorWrapper = styled.div`
  margin: 10px 0;
  border-bottom: 1px solid #444;
`;

export default observer(function Separator({ node }: ComponentProps) {
  const render = React.useContext(renderContext);
  return (
    <SeparatorWrapper data-role="separator">
      {render(node.children)}
    </SeparatorWrapper>
  );
});
