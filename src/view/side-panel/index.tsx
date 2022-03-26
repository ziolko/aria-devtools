import React, {useCallback, useEffect, useState} from "react";
import styled from "styled-components";
import {observer} from "mobx-react";

import {useStore} from "../../store-context";
import {NodeElement} from "../../AOM/types";

export default observer(function SidePanel() {
    const [isOpen, setOpen] = useStorage<boolean>("side-panel-github-visible-1", true);

    if(!isOpen) {
        return null;
    }

    return (
        <ActionsBar style={{ flexBasis: 500 }}>
            <Header>
                <Title style={{ fontSize: 20 }}>ARIA DevTools needs your help!</Title>
                <CloseIcon onClick={() => setOpen(false)}>x</CloseIcon>
            </Header>
            <HelpArticles style={{ fontSize: 18 }}>
                <p>We don't ask for much. Please just show your support by starring ARIA DevTools repository on Github.</p>
                <p>⭐⭐⭐⭐⭐</p>
                <p>
                    <a href={"https://github.com/ziolko/aria-devtools"} target="_blank" rel="noopener noreferrer">
                    Open repository
                    </a>
                </p>
            </HelpArticles>
            <UnknownRole/>
        </ActionsBar>
    );
});

const Title = styled.div`
  text-transform: capitalize;
`;

const Header = styled.div`
  justify-content: space-between;
  align-items: center;
  display: flex;
  font-size: 16px;
  padding: 4px 0;
`

const CloseIcon = styled.div`
  font-size: 20px;
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  opacity: 0.6;
  cursor: pointer;

  :hover {
    opacity: 1;
  }
`

const ResizeHandler = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${props => props.isActive ? '-1000px' : '0'};
  width: ${props => props.isActive ? '2000px' : '16px'};
  cursor: col-resize;
  z-index: 1000;
`;

const ActionsBar = styled.div`
  flex: 0 1 auto;
  background: #333;
  padding: 0 10px;
  box-sizing: border-box;
  border-left: 1px solid #555;
  position: relative;

  a {
    color: #aaa;

    :hover {
      color: #fff;
    }
  }
`;

const HelpArticles = styled.div`
;
`

const UnknownRole = styled(({className}) => {
    return (
        <div className={className}>
            <p>
                There's no documentation for this ARIA role yet.
            </p>
            <p>
                Please request support for this aria role on our{" "}
                <a href={"https://github.com/ziolko/aria-devtools/issues"} target={"_blank"}>issue tracker</a>.
            </p>
        </div>
    )
})`
  display: none;

  ${HelpArticles}:empty + & {
    display: block;
  }
`;


function useStorage<T>(key: string, defaultValue: T): [T | undefined, (value: T) => void] {
    const [value, setValue] = useState<T>();

    useEffect(() => {
        setValue(undefined);
        let isCurrent = true;
        // @ts-ignore
        chrome.storage.local.get([key], (result) => {
            isCurrent && setValue(result[key] ?? defaultValue)
        });
        return () => {
            isCurrent = false;
        }
    }, [key])

    const updateValue = useCallback((newValue: T) => {
        setValue(newValue)
        // @ts-ignore
        chrome.storage.local.set({[key]: newValue});
    }, [])

    return [value, updateValue];
}
