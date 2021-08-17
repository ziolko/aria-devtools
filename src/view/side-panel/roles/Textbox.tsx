import React from 'react';

import {NodeElement} from "../../../AOM/types";
import Article from "../RoleHelp";

export default function ({node}: { node: NodeElement }) {
    return (
        <Article role="textbox"
                 mdnLink={"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/textbox_role"}
                 node={node}>
            <p>
                {`The textbox role is used to identify an element that allows the input of free-form text. Whenever
                possible, rather than using this role, use an <input> element with type="text", for single-line input,
                or a <textarea> element for multi-line input.`}
            </p>
        </Article>
    )
}

