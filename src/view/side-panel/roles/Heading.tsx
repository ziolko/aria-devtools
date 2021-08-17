import React from 'react';

import {NodeElement} from "../../../AOM/types";
import Article from "../RoleHelp";

export default function ({node}: { node: NodeElement }) {
    return (
        <Article role="heading"
                 mdnLink={"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/heading_role"}
                 node={node}>
            <p>
                The heading role indicates to assistive technologies that this element should be treated like a heading.
                Screen readers would read the text and indicate that it is formatted like a heading.
            </p>
            <p>
                In addition, the level tells assistive technologies which part of the page structure this heading
                represents. A level 1 heading usually indicates the main heading of a page, a level 2 heading the first
                subsection, a level 3 is a subsection of that, and so on.
            </p>
        </Article>
    )
}
