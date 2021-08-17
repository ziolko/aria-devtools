import React from 'react';

import {NodeElement} from "../../../AOM/types";
import Article from "../RoleHelp";

export default function ({node}: { node: NodeElement }) {
    return (
        <Article role="list"
                 mdnLink={"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/list_role"}
                 node={node}>
            <p>
                The ARIA list role can be used to identify a list of items. It is normally used in conjunction with the
                listitem role, which is used to identify a list item contained inside the list.
            </p>
        </Article>
    )
}

