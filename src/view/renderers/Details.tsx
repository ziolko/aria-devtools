import React from "react";
import { observer } from "mobx-react";

import { ComponentProps, renderContext } from "./utils";

export default observer(function Details({ node }: ComponentProps) {
    const render = React.useContext(renderContext);
    if (node.attributes.htmlOpen) {
        const content = render(node.children);
        return <div style={{margin: "10px 0"}}>{content}</div>;
    }
    const first = node.children[0];
    if (first && first.htmlTag === "summary") {
        const content = render(first);
        return <div style={{margin: "10px 0"}}>{content}</div>;
    }
    return null;
});
