import React from 'react';

import {NodeElement} from "../../../AOM/types";
import RoleHelp from "../RoleHelp";

export default function ({node}: { node: NodeElement }) {
    return (
        <RoleHelp role="img"
                  mdnLink={"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Role_Img"}
                  node={node}>
            <p>
                The ARIA img role can be used to identify multiple elements inside page content that should be
                considered as a single image. These elements could be images, code snippets, text, emojis, or other
                content that can be combined to deliver information in a visual manner.
            </p>
        </RoleHelp>
    )
}
