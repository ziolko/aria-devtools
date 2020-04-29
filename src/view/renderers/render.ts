import React from "react";
import { AOMElement, NodeElement, TextElement } from "../../AOM/types";
import Null from "./Null";
import Block from "./Block";
import Heading from "./Heading";
import Link from "./Link";
import Button from "./Button";
import TextBox from "./TextBox";
import Figure from "./Figure";
import Paragraph from "./Paragraph";
import Unsupported from "./Unsupported";
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
import Combobox from "./Combobox";
import Cell from "./Cell";
import Table from "./Table";

type RendererMap = { [key in string]: React.FunctionComponent<ComponentProps> };

const renderers: RendererMap = {
  presentation: Null,
  none: Null,
  document: Document,
  application: Block,
  dialog: Block,
  main: Block,
  banner: Block,
  region: Block,
  definition: Block,
  navigation: Block,
  contentinfo: Block,
  complementary: Block,
  group: Block,
  radiogroup: List,
  radio: Radio,
  checkbox: Checkbox,
  article: Block,
  form: Null,
  heading: Heading,
  term: Term,
  link: Link,
  image: Image,
  img: Image,
  button: Button,
  textbox: TextBox,
  figure: Figure,
  paragraph: Paragraph,
  default: Unsupported,
  list: List,
  listitem: ListItem,
  separator: Separator,
  combobox: Combobox,
  search: Block,
  listbox: Block,
  alert: Block,
  menubar: Block,
  menu: Block,
  note: Block,
  table: Table,
  row: Block,
  rowgroup: Block,
  grid: Table,
  cell: Block,
  gridcell: Block,
  columnheader: Block,
  rowheader: Block,
  option: Option
};

const htmlTagRenderers: RendererMap = {
  label: Label
};

export default function render(element: AOMElement | AOMElement[]): any {
  if (Array.isArray(element)) {
    return element.map(render);
  }

  if (!element) {
    return null;
  }

  if (element.role === "text") {
    const textNode = element as TextElement;
    return textNode.text.trim() ? React.createElement(Text, { node: textNode, key: textNode.key }) : textNode.text;
  }

  const node = element as NodeElement;

  if (node.isHidden) {
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
    renderer = Unsupported;
  }

  return React.createElement(renderer, {
    node,
    key: node.key
  });
}
