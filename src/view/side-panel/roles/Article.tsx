import React from 'react';

import {NodeElement} from "../../../AOM/types";
import RoleHelp from "../RoleHelp";

export default function ({node}: { node: NodeElement }) {
    return (
        <RoleHelp role="article"
                  mdnLink={"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/article_role"}
                  node={node}>
            <p>
                The article role indicates a section of a page that could easily stand on its own on a page, in a
                document, or on a website. It is usually set on related content items such as comments, forum posts,
                newspaper articles or other items grouped together on one page.
            </p>
        </RoleHelp>
    )
}

