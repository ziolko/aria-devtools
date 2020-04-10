import { TextElement } from "../../AOM/types";
import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";

const Inline = styled.span`
  --block-display: inline-block;

  cursor: pointer;
  border-radius: 2px;

  :hover {
    background: #555;
  }
`;

export default observer(function Text({ node }: { node: TextElement }) {
  return <Inline>{node.text}</Inline>;
});
