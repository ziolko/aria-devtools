import React from 'react';

import {NodeElement} from "../../../AOM/types";
import Article from "../RoleHelp";

export default function ({node}: { node: NodeElement }) {
    return (
        <Article role="contentinfo"
                 mdnLink={"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/contentinfo_role"}
                 node={node}>
            <p>
                The contentinfo landmark role is used to identify information repeated at the end of every page of a
                website, including copyright information, navigation links, and privacy statements. This section is
                commonly called a footer.
            </p>
        </Article>
    )
}

