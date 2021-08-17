import React from 'react';

import {NodeElement} from "../../../AOM/types";
import Article from "../RoleHelp";

export default function ({node}: { node: NodeElement }) {
    return (
        <Article role="listitem"
                 mdnLink={"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listitem_role"}
                 node={node}>
            <p>
                The ARIA listitem role can be used to identify an item inside a list of items. It is normally used in
                conjunction with the list role, which is used to identify a list container.
            </p>
        </Article>
    )
}

