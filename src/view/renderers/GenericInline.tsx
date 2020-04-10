import { NodeElement } from "../../AOM/types";
import React from "react";
import styled from "styled-components";

const Inline = styled.span`
  --block-display: inline-block;
`;

export default function renderGenericInline(node: NodeElement, render: any) {
  return <Inline>{render(node.htmlChildren)}</Inline>;
}
