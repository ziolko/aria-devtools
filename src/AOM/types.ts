import { computed, observable } from "mobx";
import { hasEmptyRoleMapping, isRootLandmark } from "./utils";

export type HtmlID = string;
export type AomKey = string;

export class Context {
  root: NodeElement | null;
  @observable descendants: NonNullable<NodeElement>[] = [];

  constructor(root: NodeElement | null) {
    this.root = root;
  }
}

export class AomNodeRelations {
  node: NodeElement;

  constructor(node: NodeElement) {
    this.node = node;
  }

  @observable ariaOwns: NodeElement[] = [];
  @observable ariaOwnedBy: NodeElement[] = [];

  @observable ariaControls: NodeElement[] = [];
  @observable ariaControlledBy: NodeElement[] = [];

  @observable ariaDescriptions: NodeElement[] = [];
  @observable ariaDescribedBy: NodeElement[] = [];

  @observable ariaErrorMessageOf: NodeElement[] = [];
  @observable ariaErrorMessages: NodeElement[] = [];

  @observable ariaActiveDescendantOf: NodeElement[] = [];
  @observable ariaActiveDescendants: NodeElement[] = [];

  @observable ariaLabelOf: NodeElement[] = [];
  @observable ariaLabelledBy: NodeElement[] = [];

  @observable htmlForLabelOf: NodeElement[] = [];
  @observable htmlForLabelledBy: NodeElement[] = [];

  @observable formContext: Context | null = null;
  @observable fieldsetContext: Context | null = null;
  @observable labelContext: Context | null = null;

  @computed get labelOf(): NodeElement[] {
    const result = [...this.htmlForLabelOf, ...this.ariaLabelOf];

    if (
      !this.node.attributes.htmlFor &&
      this.labelContext?.root === this.node
    ) {
      result.push(...this.labelContext.descendants);
    }

    if (
      this.node.htmlTag === "legend" &&
      this.fieldsetContext?.root &&
      this.fieldsetContext?.descendants.includes(this.node)
    ) {
      result.push(this.fieldsetContext?.root);
    }

    return result;
  }

  @computed get labelledBy(): NodeElement[] {
    const result = [...this.htmlForLabelledBy, ...this.ariaLabelledBy];
    if (
      this.htmlForLabelledBy.length === 0 &&
      this.labelContext?.root &&
      this.labelContext?.descendants.includes(this.node)
    ) {
      result.push(this.labelContext.root);
    }

    if (this.fieldsetContext?.root === this.node) {
      result.push(...this.fieldsetContext.descendants);
    }
    return result;
  }
}

export type AriaRole =
  | "alert"
  | "application"
  | "article"
  | "banner"
  | "button"
  | "cell"
  | "checkbox"
  | "combobox"
  | "complementary"
  | "contentinfo"
  | "dialog"
  | "document"
  | "feed"
  | "figure"
  | "form"
  | "grid"
  | "gridcell"
  | "heading"
  | "img"
  | "image"
  | "link"
  | "list"
  | "listbox"
  | "listitem"
  | "main"
  | "navigation"
  | "paragraph"
  | "region"
  | "row"
  | "rowgroup"
  | "search"
  | "switch"
  | "tab"
  | "table"
  | "tabpanel"
  | "textbox"
  | "timer"
  | "treegrid"
  | "text"
  | "option"
  | "none"
  | "presentation"
  | "radio"
  | null;

export class TextElement {
  key: AomKey;
  role: AriaRole = "text";
  @observable text: string;
  @observable htmlParent: NodeElement | null = null;

  constructor(props: { key: AomKey; text: string }) {
    this.key = props.key;
    this.text = props.text;
  }
}

function getAccessibleNameOf(items: AOMElement[]) {
  return items
    .map(item => {
      return (
        item && (item instanceof TextElement ? item.text : item.accessibleName)
      );
    })
    .filter(name => name != null)
    .join(" ");
}

export class RawNodeAttributes {
  @observable id?: string = undefined;
  @observable role?: string = undefined;
  @observable href?: string = undefined;
  @observable disabled?: string = undefined;
  @observable src?: string = undefined;
  @observable alt?: string = undefined;
  @observable for?: string = undefined;
  @observable title?: string = undefined;
  @observable required?: string = undefined;
  @observable placeholder?: string = undefined;
  @observable type?: string = undefined;
  @observable name?: string = undefined;

  @observable "aria-activedescendant"?: HtmlID = undefined;
  @observable "aria-atomic"?: boolean = undefined;
  @observable "aria-autocomplete"?:
    | "inline"
    | "list"
    | "both"
    | "none" = undefined;
  @observable "aria-controls"?: HtmlID[] = undefined;
  @observable "aria-describedby"?: HtmlID = undefined;
  @observable "aria-haspopup"?: boolean = undefined;
  @observable "aria-label"?: string = undefined;
  @observable "aria-invalid"?: "false" | "true" = undefined;
  @observable "aria-labelledby"?: HtmlID = undefined;
  @observable "aria-level"?: string = undefined;
  @observable "aria-live"?: "off" | "polite" | "assertive" | "rude" = undefined;
  @observable "aria-multiline"?: boolean = undefined;
  @observable "aria-multiselectable"?: boolean = undefined;
  @observable "aria-orientation"?: "horizontal" | "vertical" = undefined;
  @observable "aria-owns"?: HtmlID[] = undefined;
  @observable "aria-posinset"?: string = undefined;
  @observable "aria-readonly"?: string = undefined;
  @observable "aria-required"?: string = undefined;
  @observable "aria-checked"?: string = undefined;
  @observable "aria-setsize"?: string = undefined;
  @observable "aria-sort"?:
    | "ascending"
    | "descending"
    | "none"
    | "other" = undefined;
  @observable "aria-valuemax"?: string = undefined;
  @observable "aria-valuemin"?: string = undefined;
  @observable "aria-valuenow"?: string = undefined;
  @observable "aria-valuetext"?: string = undefined;
}

function asNumber(
  value: string | number | null | undefined
): number | undefined {
  switch (typeof value) {
    case "number":
      return value;
    case "string":
      return parseInt(value);
    default:
      return undefined;
  }
}

function asBoolean(value: string | boolean | null | undefined) {
  return value === "" || value === "true" || value === true;
}

export class RawNodeProperties {
  @observable value?: string = undefined;
  @observable invalid?: boolean = undefined;
  @observable checked?: boolean = undefined;
  @observable indeterminate?: boolean = undefined;
  @observable tabIndex: number = -1;
}

export class Aria {
  private readonly node: NodeElement;
  private readonly rawAttributes: RawNodeAttributes;
  private readonly rawProperties: RawNodeProperties;

  constructor(node: NodeElement) {
    this.node = node;
    this.rawAttributes = node.getRawAttributes();
    this.rawProperties = node.getRawProperties();
  }

  @computed get mappedAttributes() {
    // HTML element & role mapping as defined at https://w3c.github.io/html-aam/#html-element-role-mappings

    const rawRole = this.rawAttributes.role?.trim();
    const htmlTag = this.node.htmlTag;

    if (rawRole) {
      return { role: rawRole };
    }

    if (hasEmptyRoleMapping(htmlTag)) {
      return null;
    }

    if (htmlTag === "main") return { role: "main" };
    if (htmlTag === "nav") return { role: "navigation" };
    if (htmlTag === "aside") return { role: "complementary" };

    if (htmlTag === "header") {
      return isRootLandmark(this.node) ? { role: "banner" } : null;
    }
    if (htmlTag === "footer") {
      return isRootLandmark(this.node) ? { role: "contentinfo" } : null;
    }

    if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(htmlTag)) {
      return {
        role: "heading",
        ariaLevel: parseInt(this.node.htmlTag.slice(1))
      };
    }

    if (htmlTag === "a") {
      return { role: this.rawAttributes.href?.trim() ? "link" : null };
    }

    if (htmlTag === "ol" || htmlTag === "ul") {
      return { role: "list" };
    }

    if (htmlTag === "li" && this.node.htmlParent) {
      const parent = this.node.htmlParent;

      if (parent.htmlTag !== "ol" && parent.htmlTag !== "ul") {
        return null;
      }

      const listItems = parent.htmlChildren.filter(
        item => item instanceof NodeElement && item.htmlTag === "li"
      );

      return {
        role: "listitem",
        ariaSetSize: listItems.length,
        ariaPosInSet: listItems.indexOf(this.node) + 1
      };
    }

    if (htmlTag === "img") {
      return {
        role: this.rawAttributes.alt?.trim() === "" ? "presentation" : "img"
      };
    }

    if (htmlTag === "form") {
      if (
        this.rawAttributes["aria-label"]?.trim() ||
        this.rawAttributes["aria-labelledby"]?.trim()
      ) {
        return { role: "form" };
      } else {
        return null;
      }
    }

    if (htmlTag === "fieldset") {
      return { role: "group" };
    }

    if (htmlTag === "input") {
      const type = this.rawAttributes.type?.trim();
      if (!type || type === "text" || type === "email") {
        return { role: "textbox" };
      }

      if (type === "checkbox") {
        const isMixed = this.rawProperties.indeterminate;
        const stringValue = this.rawProperties.checked ? "true" : "false";

        return {
          role: "checkbox",
          ariaChecked: isMixed ? "mixed" : stringValue
        };
      }

      if (type === "radio") {
        const groupName = this.rawAttributes.name?.trim();
        let ariaSetSize = undefined;
        let ariaPosInSet = undefined;

        if (groupName && this.node.relations.formContext) {
          const groupInputs = this.node.relations.formContext.descendants.filter(
            node => node.attributes.htmlName === groupName
          );

          ariaSetSize = groupInputs.length;
          ariaPosInSet = groupInputs.indexOf(this.node) + 1;
        }

        return {
          role: "radio",
          htmlChecked: this.rawProperties.checked,
          ariaSetSize,
          ariaPosInSet
        };
      }
    }

    if (htmlTag === "textarea") {
      return { role: "textbox", ariaMultiline: true };
    }

    if (htmlTag === "button") {
      return { role: "button" };
    }

    if (htmlTag === "article") {
      return { role: "article" };
    }

    if (htmlTag === "hr") {
      return { role: "separator" };
    }

    if (htmlTag === "section") {
      const hasLabel =
        this.rawAttributes["aria-label"]?.trim() ||
        this.rawAttributes["aria-labelledby"]?.trim();
      return { role: hasLabel ? "region" : null };
    }

    if (htmlTag === "dd") {
      return { role: "definition" };
    }

    if (htmlTag === "dt") {
      return { role: "term" };
    }

    return { role: "unsupported" };
  }

  @computed get id() {
    return this.rawAttributes.id?.trim();
  }
  @computed get tabindex() {
    return this.rawProperties.tabIndex;
  }
  @computed get role() {
    return (
      this.rawAttributes.role?.trim() ?? this.mappedAttributes?.role ?? null
    );
  }
  @computed get ariaLabel() {
    return this.rawAttributes["aria-label"]?.trim();
  }
  @computed get ariaLabelledBy() {
    return this.rawAttributes["aria-labelledby"]?.trim();
  }
  @computed get ariaActiveDescendant() {
    return this.rawAttributes["aria-activedescendant"]?.trim();
  }
  @computed get ariaRequired() {
    return (
      asBoolean(this.rawAttributes["required"]?.trim()) ??
      asBoolean(this.rawAttributes["aria-required"]?.trim())
    );
  }
  @computed get ariaInvalid() {
    return (
      this.rawProperties.invalid ||
      asBoolean(this.rawAttributes["aria-invalid"]?.trim())
    );
  }
  @computed get ariaMultiline() {
    return asBoolean(
      this.rawAttributes["aria-multiline"] ??
        this.mappedAttributes?.ariaMultiline
    );
  }
  @computed get ariaLevel(): number | undefined {
    return asNumber(
      this.rawAttributes["aria-level"]?.trim() ??
        this.mappedAttributes?.ariaLevel
    );
  }
  @computed get ariaSetSize(): number | undefined {
    return asNumber(
      this.rawAttributes["aria-setsize"]?.trim() ??
        this.mappedAttributes?.ariaSetSize
    );
  }
  @computed get ariaPosInSet(): number | undefined {
    return asNumber(
      this.rawAttributes["aria-posinset"]?.trim() ??
        this.mappedAttributes?.ariaPosInSet
    );
  }

  @computed get ariaChecked(): "true" | "false" | "mixed" | undefined {
    const value =
      this.rawAttributes["aria-checked"]?.trim() ??
      this.mappedAttributes?.ariaChecked;

    if (!value) {
      return undefined;
    }

    return value === "mixed" || value === "true" ? value : "false";
  }

  // @computed get setSize
  @computed get htmlFor() {
    return this.node.htmlTag === "label"
      ? this.rawAttributes["for"]?.trim()
      : undefined;
  }

  @computed get htmlName() {
    return this.rawAttributes["name"]?.trim();
  }

  @computed get htmlAlt() {
    return this.rawAttributes["alt"]?.trim();
  }

  @computed get htmlTitle() {
    return this.rawAttributes["title"]?.trim();
  }

  @computed get htmlPlaceholder() {
    return this.rawAttributes["placeholder"]?.trim();
  }

  @computed get htmlValue() {
    return this.rawProperties["value"]?.trim();
  }
  @computed get htmlChecked() {
    return this.rawProperties["checked"];
  }
}

export class NodeElement {
  readonly key: AomKey;
  readonly htmlTag: string;

  @observable isHidden: boolean;
  @observable isFocused: boolean;
  @observable htmlParent: NodeElement | null = null;
  @observable htmlChildren: NonNullable<AOMElement>[] = [];

  private _rawAttributes = new RawNodeAttributes();
  private _rawProperties = new RawNodeProperties();

  readonly attributes: Aria = new Aria(this);
  readonly relations = new AomNodeRelations(this);

  get id() {
    return this.attributes.id;
  }

  get role() {
    return this.attributes.role;
  }

  getRawAttributes() {
    return this._rawAttributes;
  }

  getRawProperties() {
    return this._rawProperties;
  }

  @computed get hasCustomAccessibleName(): boolean {
    return (
      !!this.relations.labelledBy.length ||
      this.attributes.ariaLabel != null ||
      this.attributes.htmlAlt != null ||
      this.attributes.htmlTitle != null
    );
  }

  // Accessible name is computed according to https://www.w3.org/TR/accname-1.1/#terminology
  private accessibleNameComputed = computed(() => {
    if (this.isHidden) {
      return "";
    }

    if (this.relations.ariaLabelledBy?.length) {
      return getAccessibleNameOf(this.relations.ariaLabelledBy).trim();
    }

    if (this.attributes.ariaLabel != null) {
      return this.attributes.ariaLabel;
    }

    if (this.relations.labelledBy.length) {
      return getAccessibleNameOf(this.relations.labelledBy).trim();
    }

    if (this.attributes.htmlAlt != null) {
      return this.attributes.htmlAlt;
    }
    if (this.attributes.htmlTitle != null) {
      return this.attributes.htmlTitle;
    }
    if (this.attributes.htmlPlaceholder != null) {
      return this.attributes.htmlPlaceholder;
    }

    return getAccessibleNameOf(this.htmlChildren).trim();
  });

  get accessibleName(): string {
    // Handle circular dependencies as defined in W3C specification
    // @ts-ignore
    if (this.accessibleNameComputed.isComputing) {
      return "";
    }

    return this.accessibleNameComputed.get();
  }

  constructor(props: {
    key: AomKey;
    htmlTag: string;
    isHidden: boolean;
    isFocused: boolean;
  }) {
    this.key = props.key;
    this.htmlTag = props.htmlTag;
    this.isHidden = props.isHidden;
    this.isFocused = props.isFocused;
  }
}

export type AOMElement = TextElement | NodeElement | null | undefined;
