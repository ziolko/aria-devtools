import React from 'react';

import {NodeElement} from "../../../AOM/types";
import Article from "../RoleHelp";

export default function ({node}: { node: NodeElement }) {
    return (
        <Article role="link"
                 mdnLink={"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_link_role"}
                 node={node}>
            <p>
                The link role is used to identify an element that creates a hyperlink to a resource that is in the
                application or external. When this role is added to an element, tab can be used to change focus to the link,
                and enter used to execute the link.
            </p>
        </Article>
    )
}
