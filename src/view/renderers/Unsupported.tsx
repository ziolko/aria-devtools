import { NodeElement } from "../../AOM/types";
import React from "react";
import { observer } from "mobx-react";

export default observer(function Unsupported(props: { node: NodeElement }) {
  return (
    <b>
      Unsupported role: {props.node.role} (tag: {props.node.htmlTag})
    </b>
  );
});
