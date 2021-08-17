import React from 'react';

import {NodeElement} from "../../../AOM/types";
import Article from "../RoleHelp";

export default function ({node}: { node: NodeElement }) {
    return (
        <Article role="search"
                 mdnLink={"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/search_role"}
                 node={node}>
            <p>
                The search landmark role is used to identify a section of the page used to search the page, site, or collection of sites.
            </p>
        </Article>
    )
}

