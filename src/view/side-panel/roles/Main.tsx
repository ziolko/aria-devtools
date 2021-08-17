import React from 'react';

import {NodeElement} from "../../../AOM/types";
import Article from "../RoleHelp";

export default function ({node}: { node: NodeElement }) {
    return (
        <Article role="main"
                 mdnLink={"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/main_role"}
                 node={node}>
            <p>
                The main landmark role is used to indicate the primary content of a document. The main content area
                consists of content that is directly related to or expands upon the central topic of a document, or the
                central functionality of an application.
            </p>
        </Article>
    )
}

