import React from "react";
import { observer } from "mobx-react";

import { ComponentProps } from "./utils";
import {ClickableHorizontalBlock, HeaderTag} from "./Tab";

export default observer(function MenuItem({ node }: ComponentProps) {
  const header = (
      <>
          {node.role}
          {node.attributes.ariaLevel ? ` ${node.attributes.ariaLevel}` : ""}
          <HeaderTag isVisible={node.attributes.ariaHasPopup}>[has popup]</HeaderTag>
          <HeaderTag isVisible={node.attributes.ariaExpanded}>[expanded]</HeaderTag>
      </>
  );
  return <ClickableHorizontalBlock node={node} header={header}/>
});
