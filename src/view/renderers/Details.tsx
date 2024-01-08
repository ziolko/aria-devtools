import React from "react";
import { observer } from "mobx-react";

import { ComponentProps, renderContext } from "./utils";
import { NodeElement } from "../../AOM/types";

export default observer(function Details({ node }: ComponentProps) {
    const render = React.useContext(renderContext);
    if (node.attributes.htmlOpen) {
        const content = render(node.children);
        return <div style={{margin: "10px 0"}}>{content}</div>;
    }
    const first = node.htmlChildren.find(
        (element) =>
            "htmlTag" in element ||
            ("text" in element && !element.text.match(/^\s*$/))
    )
    if (first && "htmlTag" in first && first.htmlTag === "summary") {
        const content = render(first);
        return <div style={{margin: "10px 0"}}>{content}</div>;
    }
    return null;
});
