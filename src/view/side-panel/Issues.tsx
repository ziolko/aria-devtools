import React from 'react';
import {observer} from "mobx-react";
import styled from 'styled-components'
import {NodeElement} from "../../AOM/types";
import {SectionTitle} from "./types";

export default observer(function Issues({node}: { node: NodeElement }) {
    const hasIssues = node.issues.length > 0;
    return (
        <IssuesSection>
            <SectionTitle>
                {hasIssues ? '❌ Accessibility issues detected:' : '✔️ No accessibility issues detected'}
            </SectionTitle>
            <ul>
                {node.issues.map((issue, i) => <li key={i}>{issue.summary}</li>)}
            </ul>
        </IssuesSection>
    );
});

const IssuesSection = styled.div``
