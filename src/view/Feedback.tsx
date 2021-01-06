import React from "react";
import Bowser from 'bowser'
import styled from "styled-components";

const FeedbackWrapper = styled.span`
  position: absolute;
  bottom: 15px;
  right: 15px;
`

const FeedbackButton = styled.a`
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  border: 1px solid #eee;
  margin-left: 10px;
  border-radius: 5px;
  background: #222;
  
  :hover {
    color: black;
    background: white;
    font-weight: bold;
  }
`;

const reviewUrl = `https://chrome.google.com/webstore/detail/aria-devtools/dneemiigcbbgbdjlcdjjnianlikimpck/reviews?hl=en`
const feedbackUrl = `mailto:mateusz.mzielinski@gmail.com?subject=ARIA DevTools feedback`;

const openUrl = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.href = e.currentTarget.getAttribute("href") ?? "";
    link.click();
}

const isChrome =  Bowser.getParser(window.navigator.userAgent).isBrowser("Chrome")

export default () => (
    <FeedbackWrapper>
        {isChrome && <FeedbackButton
          tabIndex={-1}
          href={reviewUrl}
          onClick={openUrl}
        >
          ⭐ Rate extension
        </FeedbackButton>
        }
      <FeedbackButton
        tabIndex={-1}
        href={feedbackUrl}
        onClick={openUrl}
      >
        📧 Send feedback
      </FeedbackButton>
    </FeedbackWrapper>
);
