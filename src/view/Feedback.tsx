import React from "react";
import styled from "styled-components";

const FeedbackButton = styled.a`
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  border: 1px solid #eee;
  :hover {
    color: black;
    background: white;
    font-weight: bold;
  }
`;

const feedbackUrl = `mailto:mateusz.mzielinski@gmail.com?subject=ARIA DevTools feedback`;

export default () => (
  <FeedbackButton
    tabIndex={-1}
    href={feedbackUrl}
    onClick={e => {
      const mail = document.createElement("a");
      mail.setAttribute("target", "_blank");
      mail.href = feedbackUrl;
      mail.click();
    }}
  >
    Send feedback
  </FeedbackButton>
);
