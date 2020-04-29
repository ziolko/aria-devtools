import React from "react";
import { renderContext, ComponentProps } from "./utils";
import { observer } from "mobx-react";
import styled from "styled-components";
import { TextBoxWrapper } from "./TextBox";
import { RadioButtonWrapper } from "./Radio";
import Text from "./Text";
import { Collapsed } from "./Null";

const LabelWrapper = styled.div`
  display: block;
  margin: 10px 0;
  
  // prettier-ignore
  & > ${TextBoxWrapper}, 
  & + ${TextBoxWrapper},
  & > ${RadioButtonWrapper}, 
  & + ${RadioButtonWrapper}{
    margin-top: 5px;
  }
`;

export default observer(function Label({ node }: ComponentProps) {
  const render = React.useContext(renderContext);

  if (node.relations.labelContext?.descendants.length) {
    return (
      <LabelWrapper>
        {render(node.relations.labelContext?.descendants)}
      </LabelWrapper>
    );
  }

  // if (node.relations.labelOf.length > 0) {
  //   return <Collapsed />;
  // }

  return <LabelWrapper>{render(node.children)}</LabelWrapper>;
});
