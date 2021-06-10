import React from "react";
import { observer } from "mobx-react";

import { ComponentProps } from "./utils";
import { ClickableHorizontalBlock } from "./Tab";

export default observer(function MenuItem({ node }: ComponentProps) {
  return <ClickableHorizontalBlock node={node} header={`${node.role} ${node.attributes.ariaLevel ?? ""}`} />
});
