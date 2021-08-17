import React from 'react';

import {NodeElement} from "../../../AOM/types";
import Article from "../RoleHelp";

export default function ({node}: { node: NodeElement }) {
    return (
        <Article role="banner"
                 mdnLink={"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/banner_role"}
                 node={node}>
            <p>
                A banner role represents general and informative content frequently placed at the beginning of the page.
                This usually includes a logo, company name, search icon, photo related to the page, or slogan.
            </p>
        </Article>
    )
}

