import React from "react";
import { AOMElement, NodeElement, TextElement } from "../../AOM/types";
import Null from "./Null";
import Block from "./Block";
import Heading from "./Heading";
import Link from "./Link";
import Button from "./Button";
import TextBox from "./TextBox";
import Paragraph from "./Paragraph";
import List from "./List";
import ListItem from "./ListItem";
import Separator from "./Separator";
import Image from "./Image";
import Text from "./Text";
import Term from "./Term";
import Option from "./Option";
import Document from "./Document";
import Label from "./Label";
import { ComponentProps } from "./utils";
import Radio from "./Radio";
import Checkbox from "./Checkbox";
import Switch from "./Switch";
import Combobox from "./Combobox";
import Table from "./Table";
import Dialog from "./Dialog";
import MenuItem from "./MenuItem";
import RadioGroup from "./RadioGroup";
import Tab from "./Tab";
import TabPanel from "./TabPanel";
import Invalid from "./Invalid";
import Details from "./Details";

type RendererMap = { [key in string]: React.FunctionComponent<ComponentProps> };

const renderers: RendererMap = {
  presentation: Null,
  none: Null,
  alert: Block,
  document: Document,
  application: Block,
  dialog: Dialog,
  alertdialog: Dialog,
  main: Block,
  banner: Block,
  region: Block,
  definition: Block,
  navigation: Block,
  toolbar: Block,
  contentinfo: Block,
  complementary: Block,
  group: Block,
  radiogroup: RadioGroup,
  radio: Radio,
  checkbox: Checkbox,
  switch: Switch,
  article: Block,
  form: Block,
  heading: Heading,
  term: Term,
  link: Link,
  image: Image,
  img: Image,
  "graphics-document": Image,
  button: Button,
  textbox: TextBox,
  figure: Block,
  feed: Block,
  paragraph: Paragraph,
  default: Invalid,
  list: List,
  listitem: ListItem,
  separator: Separator,
  combobox: Combobox,
  search: Block,
  listbox: Block,
  status: Block,
  tooltip: Block,
  tablist: Block,
  menubar: Block,
  menu: Block,
  note: Block,
  table: Table,
  row: Null,
  rowgroup: Null,
  grid: Table,
  cell: Null,
  gridcell: Null,
  columnheader: Null,
  rowheader: Null,
  menuitem: MenuItem,
  option: Option,
  tab: Tab,
  tabpanel: TabPanel,
  log: Block,
  marquee: Block,
  timer: Block,
  spinbutton: TextBox,
};

const htmlTagRenderers: RendererMap = {
  details: Details,
  label: Label,
};

export default function render(element: AOMElement | AOMElement[]): any {
  if (Array.isArray(element)) {
    return element.map(render);
  }

  if (!element) {
    return null;
  }

  if (element.role === "aria-devtools-text") {
    const textNode = element as TextElement;
    return textNode.text.trim() ? React.createElement(Text, { node: textNode, key: textNode.key }) : textNode.text;
  }

  const node = element as NodeElement;

  if (node.isHidden && !node.containsFocus) {
    return null;
  }

  let renderer;

  if (node.role == null) {
    if (htmlTagRenderers.hasOwnProperty(node.htmlTag)) {
      renderer = htmlTagRenderers[node.htmlTag];
    } else {
      renderer = Null;
    }
  } else if (renderers.hasOwnProperty(node.role)) {
    renderer = renderers[node.role];
  } else {
    renderer = Invalid;
  }

  const result = React.createElement(renderer, {
    node,
    key: node.key
  });

  if(!node.beforeContent && !node.afterContent) {
    return result;
  }

  return React.createElement(React.Fragment, {
    children: [node.beforeContent, result, node.afterContent].filter(x=>!!x)
  });
}
