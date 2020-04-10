import { NodeElement } from "../../AOM/types";
import React from "react";

export default function GenericBlock(node: NodeElement, render: any) {
  return <div data-type="generic-block">{render(node.htmlChildren)}</div>;
}
