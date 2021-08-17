import React from 'react';
import {observer} from "mobx-react";
import Issues from "./Issues";
import {NodeElement} from "../../AOM/types";

type ArticleProps = {
    role: string,
    node: NodeElement,
    children: React.ReactNode,
    mdnLink: string
};

export default observer(function Article({role, node, children, mdnLink}: ArticleProps) {
    if(node.role !== role) {
        return null
    }

    return <>
        {children}
        <p><a href={mdnLink} target="_blank">Learn more on MDN</a></p>
        <Issues node={node}/>
    </>
});

