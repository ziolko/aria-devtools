import React from 'react';
import {observer} from "mobx-react";

export default observer(function Issues() {
    return (
        <em>
            Note: Roles description is currently in beta. Please share your
            feedback and suggestions in our{" "}
            <a href={"https://github.com/ziolko/aria-devtools/issues"} target={"_blank"}>issue tracker</a>.
        </em>
    );
});