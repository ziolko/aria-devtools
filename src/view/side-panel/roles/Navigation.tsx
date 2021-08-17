import React from 'react';

import {NodeElement} from "../../../AOM/types";
import Article from "../RoleHelp";

export default function ({node}: { node: NodeElement }) {
    return (
        <Article role="navigation"
                 mdnLink={"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/navigation_role"}
                 node={node}>
            <p>
                The navigation role is a landmark role. Landmark roles provide a way to identify the organization and
                structure of a web page. By classifying and labeling sections of a page, structural information conveyed
                visually through layout is represented programmatically.
            </p>
            <p>
                It is preferable to use the HTML5 {"<nav>"} element to define a navigation landmark. If the HTML5 nav element
                technique is not being used, use a role="navigation" attribute to define a navigation landmark.
            </p>
        </Article>
    )
}