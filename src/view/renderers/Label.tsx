import React from "react";
import {ComponentProps, renderContext} from "./utils";
import {observer} from "mobx-react";
import styled from "styled-components";
import {TextBoxContent} from "./TextBox";
import {RadioButtonWrapper} from "./Radio";
import {Collapsed} from "./Null";

const LabelWrapper = styled.div`
  display: block;
  margin: 10px 0;

  // prettier-ignore
  & > ${TextBoxContent},
  & + ${TextBoxContent},
  & > ${RadioButtonWrapper},
  & + ${RadioButtonWrapper} {
    margin-top: 5px;
  }
`;

export default observer(function Label({node}: ComponentProps) {
    const render = React.useContext(renderContext);

    if (node.relations.labelContext?.descendants.length) {
        return (
            <LabelWrapper>
                {render(node.relations.labelContext?.descendants)}
            </LabelWrapper>
        );
    }

    if (node.relations.labelOf.length > 0) {
        return <Collapsed>{render(node.children)}</Collapsed>;
    }

    return <LabelWrapper>{render(node.children)}</LabelWrapper>;
});
