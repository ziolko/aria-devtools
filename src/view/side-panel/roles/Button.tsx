import React from 'react';

import {NodeElement} from "../../../AOM/types";
import Article from "../RoleHelp";

export default function ({node}: { node: NodeElement }) {
    return (
        <Article role="button"
                 mdnLink={"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_link_role"}
                 node={node}>
            <p>
                The button role identifies an element as a button to screen readers. A button is a widget used to
                perform actions such as submitting a form, opening a dialog, cancelling an action, or performing a
                command such as inserting a new record or displaying information.
            </p>
        </Article>
    )
}

