import * as React from "react";
import { expect } from "chai";
import sandbox from "./sandbox";
import { NodeElement } from "../src/AOM/types";

describe("HTML-ARIA mappings", () => {
  it("Should map landmarks in scope of body", () => {
    const { AOM } = sandbox(
      <div>
        <main id="main">main</main>
        <nav id="nav">nav</nav>
        <aside id="aside">aside</aside>
        <header id="header">header</header>
        <footer id="footer">footer</footer>
      </div>
    );

    expect(AOM.main.role).to.equal("main");
    expect(AOM.header.role).to.equal("banner");
    expect(AOM.footer.role).to.equal("contentinfo");
    expect(AOM.nav.role).to.equal("navigation");
    expect(AOM.aside.role).to.equal("complementary");
  });

  it("Should properly map footer when not scoped to body", () => {
    const { AOM } = sandbox(
      <div>
        <main>
          <header id="main-header"></header>
          <footer id="main-footer"></footer>
        </main>

        <article>
          <header id="article-header"></header>
          <footer id="article-footer"></footer>
        </article>
      </div>
    );

    expect(AOM["main-header"].role, "main-header").to.be.null;
    expect(AOM["main-footer"].role, "main-footer").to.be.null;

    expect(AOM["article-header"].role, "article-header").to.be.null;
    expect(AOM["article-footer"].role, "article-footer").to.be.null;
  });

  it("Should properly map null role", () => {
    // @ts-ignore
    const { AOM } = sandbox(
      <div id="result">
        <audio />
        <abbr />
        <b />
        <base />
        <bdi />
        <bdo />
        <blockquote />
        <body />
        <br />
        <canvas />
        <caption />
        <cite />
        <code />
        <col />
        <colgroup />
        <data />
        <del />
        <details />
        <div />
        <dl />
        <em />
        <embed />
        <figcaption />
        <hgroup />
        <i />
        <iframe />
        <ins />
        <kbd />
        <label />
        <legend />
        <link />
        <map />
        <mark />
        <math />
        <meta />
        <meter />
        <noscript />
        <object />
        <p />
        <param />
        <picture />
        <pre />
        <q />
        <rp />
        <rt />
        <ruby />
        <s />
        <samp />
        <slot />
        <small />
        <source />
        <span />
        <strong />
        <sub />
        <sup />
        <template />
        <time />
        <title />
        <track />
        <u />
        <var />
        <video />
        <wbr />
      </div>
    );

    expect(AOM.result.htmlChildren.length).to.equal(62);

    AOM.result.htmlChildren.forEach(x => {
      const comment = x instanceof NodeElement && `HTML tag ${x.htmlTag}`;
      expect(x.role, comment).to.be.null;
    });
  });

  it("Should map HTML headings", () => {
    const { AOM } = sandbox(
      <div>
        <h1 id="h1" />
        <h2 id="h2" />
        <h3 id="h3" />
        <h4 id="h4" />
        <h5 id="h5" />
        <h6 id="h6" />
      </div>
    );

    for (let i = 1; i <= 6; i++) {
      const node = AOM[`h${i}`];
      expect(node.role, `H${i} role`).to.equal("heading");
      expect(node.attributes.ariaLevel).to.equal(i);
    }
  });

  it("Should map A with href as a link", () => {
    const { AOM } = sandbox(<a id="result" href="#" />);
    expect(AOM.result.role).to.be.equal("link");
  });

  it("Should map A without href as null", () => {
    const { AOM } = sandbox(<a id="result" />);
    expect(AOM.result.role).to.be.null;
  });

  it("Should map UL and OL as list", () => {
    const { AOM } = sandbox(
      <div>
        <ul id="ul" />
        <ol id="ol" />
      </div>
    );
    expect(AOM.ul.role).to.be.equal("list");
    expect(AOM.ol.role).to.be.equal("list");
  });

  it("Should map LI under UL as list item", () => {
    const { AOM } = sandbox(
      <ul>
        <li id="li-1" />
        <li id="li-2" />
        <li id="li-3" />
      </ul>
    );

    for (let i = 1; i <= 3; i++) {
      const item = AOM[`li-${i}`];
      expect(item.role, "role").to.be.equal("listitem");
      expect(item.attributes.ariaSetSize, "setsize").to.be.equal(3);
      expect(item.attributes.ariaPosInSet, "posinset").to.be.equal(i);
    }
  });

  it("Should skip separators on a list", () => {
    const {AOM} = sandbox(
      <ul className="dropdown-menu">
        <li id="li-1"><a href="#">My cart</a></li>
        <li id="li-2"><a href="#">My orders</a></li>
        <li id="li-3"><a href="#">My details</a></li>
        <li role="separator"/>
        <li id="li-4"><a href="#">Log out</a></li>
      </ul>
    );

    for (let i = 1; i <= 3; i++) {
      const item = AOM[`li-${i}`];
      expect(item.role, "role").to.be.equal("listitem");
      expect(item.attributes.ariaSetSize, "setsize").to.be.equal(4);
      expect(item.attributes.ariaPosInSet, "posinset").to.be.equal(i);
    }
  })


  it("Should map IMG without alt as img role", () => {
    const { AOM } = sandbox(<img id="result" />);
    expect(AOM.result.role).to.be.equal("img");
  });

  it("Should map IMG with non-empty alt as img role", () => {
    const { AOM } = sandbox(<img alt="My image" id="result" />);
    expect(AOM.result.role).to.be.equal("img");
  });

  it("Should map IMG with empty alt as presentation role", () => {
    const { AOM } = sandbox(<img id="result" alt="" />);
    expect(AOM.result.role).to.be.equal("presentation");
  });

  it("Should map form with aria-label as form", () => {
    const { AOM } = sandbox(<form id="result" aria-label="My form" />);
    expect(AOM.result.role).to.be.equal("form");
  });

  it("Should map form with aria-labelledby as form", () => {
    const { AOM } = sandbox(<form id="result" aria-labelledby="form-label" />);
    expect(AOM.result.role).to.be.equal("form");
  });

  it("Should map form without label as null", () => {
    const { AOM } = sandbox(<form id="result" />);
    expect(AOM.result.role).to.be.null;
  });

  it("Should map fieldset as group", () => {
    const { AOM } = sandbox(<fieldset id="result" />);
    expect(AOM.result.role).to.be.equal("group");
  });

  it("Should map input with no type attribute as textbox", () => {
    const { AOM } = sandbox(<input id="result" />);
    expect(AOM.result.role).to.be.equal("textbox");
  });

  it("Should map input with type = 'text' as textbox", () => {
    const { AOM } = sandbox(<input type="text" id="result" />);
    expect(AOM.result.role).to.be.equal("textbox");
  });

  it("Should map input with type = 'email' as textbox", () => {
    const { AOM } = sandbox(<input type="email" id="result" />);
    expect(AOM.result.role).to.be.equal("textbox");
  });

  it("Should map textarea as multiline textbox", () => {
    const { AOM } = sandbox(<textarea id="result" />);
    expect(AOM.result.role).to.be.equal("textbox");
    expect(AOM.result.attributes.ariaMultiline).to.be.true;
  });

  it("Should map button as button", () => {
    const { AOM } = sandbox(<button id="result" />);
    expect(AOM.result.role).to.be.equal("button");
  });

  it("Should map radio buttons", () => {
    const { AOM } = sandbox(
      <form id="result">
        <input id="input1" type="radio" name="group1" />
        <input id="input2" type="radio" name="group1" />
        <input id="input3" type="radio" name="group1" />
        <input id="input4" type="radio" name="group2" />
      </form>
    );
    expect(AOM.input1.role, "role").to.be.equal("radio");
    expect(AOM.input1.attributes.ariaSetSize, "Set size").to.be.equal(3);
    expect(AOM.input1.attributes.ariaPosInSet, "Radio 1 position").to.equal(1);
    expect(AOM.input2.attributes.ariaPosInSet, "Radio 2 position").to.equal(2);
    expect(AOM.input3.attributes.ariaPosInSet, "Radio 3 position").to.equal(3);

    expect(AOM.input4.attributes.ariaSetSize, "Separate group").to.equal(1);
  });

  it("Should map checkbox", async () => {
    const { AOM, DOM, updateSideEffects } = sandbox(
      <div>
        <input type="checkbox" id="true" defaultChecked={true} />
        <input type="checkbox" id="false" defaultChecked={false} />
        <input type="checkbox" id="mixed" />
      </div>
    );

    (DOM.mixed as HTMLInputElement).indeterminate = true;
    updateSideEffects();

    expect(AOM.true.role).to.be.equal("checkbox");
    expect(AOM.false.role).to.be.equal("checkbox");
    expect(AOM.mixed.role).to.be.equal("checkbox");

    expect(AOM.true.attributes.ariaChecked, "checked").to.be.equal("true");
    expect(AOM.false.attributes.ariaChecked, "not-checked").to.be.equal(
      "false"
    );

    expect(AOM.mixed.attributes.ariaChecked, "mixed state").to.be.equal(
      "mixed"
    );
  });

  it("Should map section without a label to null", () => {
    const { AOM } = sandbox(<section id="result" />);
    expect(AOM.result.role).to.be.equal(null);
  });

  it("Should map section with aria-label to region", () => {
    const { AOM } = sandbox(
      <section id="result" aria-label="Sample section" />
    );
    expect(AOM.result.role).to.be.equal("region");
  });

  it("Should map section with aria-labelledby to region", () => {
    const { AOM } = sandbox(<section id="result" aria-labelledby="label" />);
    expect(AOM.result.role).to.be.equal("region");
  });

  it("Should map hr to a separator", () => {
    const { AOM } = sandbox(<hr id="result" />);
    expect(AOM.result.role).to.be.equal("separator");
  });

  it("Should map dd to a definition", () => {
    const { AOM } = sandbox(<dd id="result" />);
    expect(AOM.result.role).to.be.equal("definition");
  });

  it("Should map dt to a term", () => {
    const { AOM } = sandbox(<dt id="result" />);
    expect(AOM.result.role).to.be.equal("term");
  });

  it("Should map select with no mutliple and no size > 1 to combobox", () => {
    const { AOM } = sandbox(<select id="result" />);
    expect(AOM.result.role).to.be.equal("combobox");
  });

  it("Should map optgroup to group", () => {
    const { AOM } = sandbox(<optgroup id="result" />);
    expect(AOM.result.role).to.be.equal("group");
  });

  it("Should map option to option", () => {
    const { AOM } = sandbox(<option id="result" />);
    expect(AOM.result.role).to.be.equal("option");
  });

  it("Should map summary to button", () => {
    const { AOM } = sandbox(<summary id="result" />);
    expect(AOM.result.role).to.be.equal("button");
  });
});
