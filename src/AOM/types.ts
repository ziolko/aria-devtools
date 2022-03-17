import {action, computed, observable} from "mobx";
import {getNodeKey, hasEmptyRoleMapping, isFocused, isHidden, isInline, isRootLandmark} from "./utils";
import {AriaIssues} from "./issues";

export type HtmlID = string;
export type AomKey = string;

export class Context {
    root: NodeElement | null;
    @observable descendants: NonNullable<NodeElement>[] = [];

    constructor(root: NodeElement | null) {
        this.root = root;
    }
}

export interface TableCell {
    rowIndex: number;
    colIndex: number;
    rowSpan: number;
    colSpan: number;
    colHeaders: NodeElement[];
    rowHeaders: NodeElement[];
}

class Table {
    data: NodeElement[][] = [];

    set(row: number, col: number, node: NodeElement) {
        this.data[row] = this.data[row] ?? [];
        this.data[row][col] = node;
    }

    get(row: number, col: number) {
        return this.data[row] && this.data[row][col];
    }
}

export class HtmlTableContext {
    root: NodeElement;

    @observable _visibleRow: number = 0;
    @observable _visibleColumn: number = 0;

    @computed get visibleRow(): number {
        if (!this.rows.length) {
            return -1;
        }

        const maxRow = this.rows.length - 1;
        if (this._visibleRow < 0) return 0;
        if (this._visibleRow >= maxRow) return maxRow;

        return this._visibleRow;
    }

    set visibleRow(value: number) {
        this._visibleRow = value;
    }

    @computed get visibleColumn(): number {
        if (!this.rows[this.visibleRow]?.length) {
            return -1;
        }

        const maxCol = this.rows[this.visibleRow].length - 1;
        if (this._visibleColumn < 0) return 0;
        if (this._visibleColumn >= maxCol) return maxCol;

        return this._visibleColumn;
    }

    set visibleColumn(value: number) {
        this._visibleColumn = value;
    }

    @computed get visibleCell(): NodeElement | null {
        if (!this.rows) {
            return null;
        }

        return this.rows[this.visibleRow] && this.rows[this.visibleRow][this.visibleColumn];
    }

    @action showCellWithNode(element: NodeElement) {
        for (let node: NodeElement | null = element; node != null; node = node.ariaParent) {
            const cell = this.cells.get(node);
            if (cell) {
                this.visibleRow = cell.rowIndex;
                this.visibleColumn = cell.colIndex;
            }
        }
    }

    private getNextRow(step: 1 | -1) {
        return this.findNextIndex(
            this.rows,
            this.visibleRow,
            step,
            row => row[this.visibleColumn] && row[this.visibleColumn] !== this.visibleCell
        );
    }

    private getNextColumn(step: 1 | -1) {
        return this.findNextIndex(this.rows[this.visibleRow], this.visibleColumn, step, x => x && x !== this.visibleCell);
    }

    @action showNextRow() {
        const row = this.getNextRow(1);

        if (row != null) {
            this.visibleRow = row;
        }
    }

    @action showPreviousRow() {
        const row = this.getNextRow(-1);

        if (row != null) {
            this.visibleRow = row;
        }
    }

    @action showNextColumn() {
        const column = this.getNextColumn(1);

        if (column != null) {
            this.visibleColumn = column;
        }
    }

    @action showPreviousColumn() {
        const column = this.getNextColumn(-1);

        if (column != null) {
            this.visibleColumn = column;
        }
    }

    private findNextIndex<T>(list: T[], start: number, step: number, condition: (arg: T) => boolean) {
        for (let i = start; i >= 0 && i < list.length; i += step) {
            if (condition(list[i])) return i;
        }
        return null;
    }

    private getNodes(root: NodeElement, ...allowedTags: string[]): NodeElement[] {
        return root.children.filter(child => {
            return child instanceof NodeElement && allowedTags.includes(child.htmlTag);
        }) as NodeElement[];
    }

    @computed get rows(): NodeElement[][] {
        const result = new Table();

        const rowNodes = this.getNodes(this.root, "tr", "tbody", "tfooter", "thead")
            .map(node => (node.htmlTag === "tr" ? node : this.getNodes(node, "tr")))
            .flat();

        rowNodes.forEach((rowNode, rowIndex) => {
            let colIndex = 0;
            result.data[rowIndex] = result.data[rowIndex] || []

            this.getNodes(rowNode, "td", "th").forEach(cell => {
                while (result.get(rowIndex, colIndex)) colIndex++;
                const {rowSpan, colSpan} = cell.getRawProperties();

                for (let i = 0; i < (rowSpan ?? 1); i++) {
                    for (let j = 0; j < (colSpan ?? 1); j++) {
                        result.set(rowIndex + i, colIndex + j, cell);
                    }
                }
            });
        });
        return result.data;
    }

    @computed get colCount() {
        let result = 0;
        this.rows.forEach(row => (result = Math.max(result, row.length)));
        return result;
    }

    @computed get rowCount() {
        // TODO - compute it properly taking into account rowspan
        return this.rows.length;
    }

    @computed get colHeaders(): NodeElement[][] {
        const result: NodeElement[][] = [];

        for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
            if (this.rows[rowIndex].every(x => x.htmlTag === "th")) {
                for (let colIndex = 0; colIndex < this.rows[rowIndex].length; colIndex++) {
                    result[colIndex] = result[colIndex] ?? [];
                    result[colIndex].push(this.rows[rowIndex][colIndex]);
                }
            } else {
                for (let colIndex = 0; colIndex < this.rows[rowIndex].length; colIndex++) {
                    result[colIndex] = result[colIndex] ?? [];
                    const attrs = this.rows[rowIndex][colIndex]?.getRawAttributes();
                    if (attrs?.scope === "column" || attrs?.role === "columnheader") {
                        result[colIndex].push(this.rows[rowIndex][colIndex]);
                    }
                }
            }
        }

        return result;
    }

    @computed get rowHeaders(): NodeElement[][] {
        const result: NodeElement[][] = [];

        for (let colIndex = 0; colIndex < this.colCount; colIndex++) {
            if (this.rows.every(row => row[colIndex] == null || row[colIndex].htmlTag === "th")) {
                for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
                    result[rowIndex] = result[rowIndex] ?? [];
                    if (!this.colHeaders[colIndex].includes(this.rows[rowIndex][colIndex])) {
                        result[rowIndex].push(this.rows[rowIndex][colIndex]);
                    }
                }
            } else {
                for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
                    result[rowIndex] = result[rowIndex] ?? [];
                    const attrs = this.rows[rowIndex][colIndex]?.getRawAttributes();
                    if (attrs?.scope === "row" || attrs?.role === "rowheader") {
                        result[rowIndex].push(this.rows[rowIndex][colIndex]);
                    }
                }
            }
        }

        return result;
    }

    @computed get cells(): Map<NodeElement, TableCell> {
        const result = new Map<NodeElement, TableCell>();

        this.rows.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const entry = result.get(cell);
                const rowHeaders = this.rowHeaders[rowIndex] ?? [];
                const colHeaders = this.colHeaders[colIndex] ?? [];

                if (entry) {
                    entry.rowHeaders.push(...rowHeaders.filter(x => !entry.rowHeaders.includes(x)));
                    entry.colHeaders.push(...colHeaders.filter(x => !entry.colHeaders.includes(x)));
                    entry.rowSpan = rowIndex - entry.rowIndex + 1;
                    entry.colSpan = colIndex - entry.colIndex + 1;
                } else {
                    result.set(cell, {
                        rowHeaders: [...rowHeaders],
                        colHeaders: [...colHeaders],
                        rowIndex,
                        colIndex,
                        rowSpan: 1,
                        colSpan: 1
                    });
                }
            });
        });

        return result;
    }

    constructor(root: NodeElement) {
        this.root = root;
    }
}

export class AriaTableContext extends HtmlTableContext {
    private getDescendants(root: NodeElement, ...allowedRoles: AriaRole[]): NodeElement[] {
        if (allowedRoles.includes(root.role)) {
            return [root];
        }

        return root.children
            .map(child => (child instanceof NodeElement ? this.getDescendants(child, ...allowedRoles) : []))
            .flat();
    }

    @computed get rows(): NodeElement[][] {
        const result = new Table();
        const rowNodes = this.getDescendants(this.root, "row");

        rowNodes.forEach((rowNode, rowIndex) => {
            let colIndex = 0;

            this.getDescendants(rowNode, "columnheader", "rowheader", "cell", "gridcell").forEach(cell => {
                while (result.get(rowIndex, colIndex)) colIndex++;

                const attrs = cell.getRawAttributes();
                const rowSpan = asNumber(attrs["aria-rowspan"]) ?? 1;
                const colSpan = asNumber(attrs["aria-rowspan"]) ?? 1;

                const row = asNumber(attrs["aria-rowindex"]) ?? rowIndex;
                const column = asNumber(attrs["aria-colindex"]) ?? colIndex;

                for (let i = 0; i < (rowSpan ?? 1); i++) {
                    for (let j = 0; j < (colSpan ?? 1); j++) {
                        result.set(row + i, column + j, cell);
                    }
                }
            });
        });
        return result.data;
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
    @observable ariaLiveContext: Context | null = null;
    @observable tableContext: HtmlTableContext | null = null;

    @observable previousHeading?: NodeElement | null;

    @computed get labelOf(): NodeElement[] {
        const result = [...this.htmlForLabelOf, ...this.ariaLabelOf];

        if (!this.node.attributes.htmlFor && this.labelContext?.root === this.node) {
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
    | "separator"
    | "switch"
    | "tab"
    | "table"
    | "tabpanel"
    | "textbox"
    | "timer"
    | "treegrid"
    | "columnheader"
    | "rowheader"
    | "cell"
    | "gridcell"
    | "aria-devtools-text"
    | "text"
    | "option"
    | "none"
    | "presentation"
    | "radio"
    | "spinbutton"
    | null;

export class TextElement {
    readonly key: AomKey;
    readonly role: AriaRole = "aria-devtools-text";
    readonly domNode: HTMLElement | null;

    @observable text: string;
    @observable htmlParent: NodeElement | null = null;

    @computed get hasContent() {
        return !!this.text.trim();
    }

    @computed get ariaParent() {
        return this.htmlParent;
    }

    @computed get accessibleName() {
        return this.text;
    }

    constructor(props: { key: AomKey; text: string; node: HTMLElement | null }) {
        this.key = props.key;
        this.text = props.text;
        this.domNode = props.node;
    }
}

export function getAccessibleNameOf(items: AOMElement[]) {
    return items
        .map(item => {
            return item && (item instanceof TextElement ? item.text : item.accessibleName);
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
    @observable multiple?: string = undefined;
    @observable size?: string = undefined;
    @observable scope?: string = undefined;
    @observable min?: string = undefined;
    @observable max?: string = undefined;

    @observable "aria-activedescendant"?: HtmlID = undefined;
    @observable "aria-atomic"?: boolean = undefined;
    @observable "aria-autocomplete"?: "inline" | "list" | "both" | "none" = undefined;
    @observable "aria-controls"?: HtmlID = undefined;
    @observable "aria-disabled"?: string = undefined;
    @observable "aria-modal"?: string = undefined;
    @observable "aria-describedby"?: HtmlID = undefined;
    @observable "aria-haspopup"?: string = undefined;
    @observable "aria-expanded"?: string = undefined;
    @observable "aria-label"?: string = undefined;
    @observable "aria-invalid"?: "false" | "true" = undefined;
    @observable "aria-labelledby"?: HtmlID = undefined;
    @observable "aria-level"?: string = undefined;
    @observable "aria-live"?: "off" | "polite" | "assertive" = undefined;
    @observable "aria-pressed"?: "false" | "true" = undefined;
    @observable "aria-multiline"?: boolean = undefined;
    @observable "aria-multiselectable"?: string = undefined;
    @observable "aria-selected"?: string = undefined;
    @observable "aria-orientation"?: "horizontal" | "vertical" = undefined;
    @observable "aria-owns"?: string = undefined;
    @observable "aria-posinset"?: string = undefined;
    @observable "aria-colindex"?: string = undefined;
    @observable "aria-rowindex"?: string = undefined;
    @observable "aria-rowspan"?: string = undefined;
    @observable "aria-colspan"?: string = undefined;
    @observable "aria-readonly"?: string = undefined;
    @observable "aria-required"?: string = undefined;
    @observable "aria-checked"?: string = undefined;
    @observable "aria-setsize"?: string = undefined;
    @observable "aria-sort"?: "ascending" | "descending" | "none" | "other" = undefined;
    @observable "aria-valuemax"?: string = undefined;
    @observable "aria-valuemin"?: string = undefined;
    @observable "aria-valuenow"?: string = undefined;
    @observable "aria-valuetext"?: string = undefined;
}

function asNumber(value: string | number | null | undefined): number | undefined {
    switch (typeof value) {
        case "number":
            return value;
        case "string":
            return value ? parseInt(value) : undefined;
        default:
            return undefined;
    }
}

function asBoolean(value: string | boolean | null | undefined) {
    const isTrue = value === "" || value === "true" || value === true;
    const isFalse = value === "false";
    if (isTrue) return true;
    if (isFalse) return false;
    return undefined;
}

export class RawNodeProperties {
    @observable value?: string = undefined;
    @observable invalid?: boolean = undefined;
    @observable disabled?: boolean = undefined;
    @observable checked?: boolean = undefined;
    @observable indeterminate?: boolean = undefined;
    @observable tabIndex: number = -1;
    @observable colSpan?: number = undefined;
    @observable rowSpan?: number = undefined;
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
            if (["cell", "gridcell", "columnheader", "rowheader"].includes(rawRole)) {
                const data = this.node.relations.tableContext?.cells.get(this.node);
                if (data) {
                    return {
                        role: rawRole,
                        headers: [...data.rowHeaders, ...data.colHeaders],
                        colIndex: data.colIndex + 1,
                        rowIndex: data.rowIndex + 1,
                        colSpan: data.colSpan,
                        rowSpan: data.rowSpan
                    };
                }
            }

            if (rawRole === "alert") {
                return {role: rawRole, ariaLive: "assertive", ariaAtomic: true};
            }

            if (rawRole === "switch" && htmlTag === "input" && this.rawAttributes.type?.trim() === "checkbox") {
                return {
                    role: rawRole,
                    ariaChecked: this.rawProperties.checked ? "true" : "false",
                    ariaDisabled: this.rawProperties.disabled
                };
            }

            return {role: rawRole};
        }

        if (hasEmptyRoleMapping(htmlTag)) {
            return null;
        }

        if (htmlTag === "main") return {role: "main"};
        if (htmlTag === "nav") return {role: "navigation"};
        if (htmlTag === "aside") return {role: "complementary"};

        if (htmlTag === "header") {
            return isRootLandmark(this.node) ? {role: "banner"} : null;
        }
        if (htmlTag === "footer") {
            return isRootLandmark(this.node) ? {role: "contentinfo"} : null;
        }

        if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(htmlTag)) {
            return {
                role: "heading",
                ariaLevel: parseInt(this.node.htmlTag.slice(1))
            };
        }

        if (htmlTag === "a" || htmlTag === "area") {
            return {role: this.rawAttributes.href?.trim() ? "link" : null};
        }

        if (htmlTag === "menu") {
            return {role: "list"};
        }

        if (htmlTag === "ol" || htmlTag === "ul") {
            return {role: "list"};
        }

        if (htmlTag === "li" && this.node.htmlParent) {
            const parent = this.node.htmlParent;

            if (parent.htmlTag !== "ol" && parent.htmlTag !== "ul") {
                return null;
            }

            const listItems = parent.htmlChildren.filter(item => item instanceof NodeElement && item.htmlTag === "li" && item.getRawAttributes().role !== "separator");

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
            if (this.rawAttributes["aria-label"]?.trim() || this.rawAttributes["aria-labelledby"]?.trim()) {
                return {role: "form"};
            } else {
                return null;
            }
        }

        if (htmlTag === "fieldset") {
            return {role: "group"};
        }

        if (htmlTag === "input") {
            const type = this.rawAttributes.type?.trim();

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

            if (type === "submit") {
                return {role: "button"};
            }

            if (type === "number") {
                return {
                    role: "spinbutton",
                    ariaValueMin: this.rawAttributes.min,
                    ariaValueMax: this.rawAttributes.max,
                    ariaValueNow: this.htmlValue
                };
            }

            return {role: "textbox"};
        }

        if (htmlTag === "textarea") {
            return {role: "textbox", ariaMultiline: true};
        }

        if (htmlTag === "button") {
            return {role: "button"};
        }

        if (htmlTag === "article") {
            return {role: "article"};
        }

        if (htmlTag === "figure") {
            return {role: "figure"};
        }

        if (htmlTag === "hr") {
            return {role: "separator"};
        }

        if (htmlTag === "section") {
            const hasLabel = this.rawAttributes["aria-label"]?.trim() || this.rawAttributes["aria-labelledby"]?.trim();
            return {role: hasLabel ? "region" : null};
        }

        if (htmlTag === "dd") {
            return {role: "definition"};
        }

        if (htmlTag === "dt") {
            return {role: "term"};
        }

        if (htmlTag === "select") {
            const isMultiple = this.rawAttributes.multiple != undefined;
            const size = asNumber(this.rawAttributes.size);

            if (isMultiple || (size && size > 1)) {
                return {role: "listbox"};
            } else {
                return {role: "combobox", ariaExpanded: false};
            }
        }

        if (htmlTag === "optgroup") {
            return {role: "group"};
        }

        if (htmlTag === "option") {
            return {role: "option"};
        }

        if (htmlTag === "svg") {
            return {role: "graphics-document"};
        }

        if (htmlTag === "table") {
            return {role: "table"};
        }

        if (htmlTag === "thead" || htmlTag === "tbody" || htmlTag === "tfoot") {
            return {role: "rowgroup"};
        }

        if (htmlTag === "tr") {
            return {role: "row"};
        }

        if (htmlTag === "td" || htmlTag === "th") {
            const data = this.node.relations.tableContext?.cells.get(this.node);

            if (!this.node.relations.tableContext || !data) {
                return null;
            }

            let role = "cell";

            if (htmlTag === "th") {
                const colHeaders = this.node.relations.tableContext.colHeaders;
                const rowHeaders = this.node.relations.tableContext.rowHeaders;

                if (colHeaders[data.colIndex].includes(this.node)) {
                    role = "columnheader";
                } else if (rowHeaders[data.rowIndex].includes(this.node)) {
                    role = "rowheader";
                }
            }

            return {
                role,
                headers: [...data.rowHeaders, ...data.colHeaders],
                colIndex: data.colIndex + 1,
                rowIndex: data.rowIndex + 1,
                colSpan: data.colSpan,
                rowSpan: data.rowSpan
            };
        }

        return {role: "undefined"};
    }

    @computed get id() {
        return this.rawAttributes.id?.trim();
    }

    @computed get tabindex() {
        return this.rawProperties.tabIndex;
    }

    @computed get role() {
        return (this.rawAttributes.role?.trim() ?? this.mappedAttributes?.role ?? null) as AriaRole;
    }

    @computed get disabled() {
        return this.rawAttributes.disabled != null || asBoolean(this.rawAttributes["aria-disabled"]);
    }

    @computed get ariaControls() {
        return this.rawAttributes["aria-controls"]?.trim();
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

    @computed get ariaOwns() {
        return this.rawAttributes["aria-owns"]?.trim();
    }

    @computed get ariaRequired() {
        return asBoolean(this.rawAttributes["required"]?.trim()) ?? asBoolean(this.rawAttributes["aria-required"]?.trim());
    }

    @computed get ariaInvalid() {
        return this.rawProperties.invalid || asBoolean(this.rawAttributes["aria-invalid"]?.trim());
    }

    @computed get ariaMultiline() {
        return asBoolean(this.rawAttributes["aria-multiline"] ?? this.mappedAttributes?.ariaMultiline);
    }

    @computed get ariaMultiselectable() {
        return asBoolean(this.rawAttributes["aria-multiselectable"]);
    }

    @computed get ariaSelected() {
        return asBoolean(this.rawAttributes["aria-selected"]);
    }

    @computed get ariaPressed(): boolean {
        return asBoolean(this.rawAttributes["aria-pressed"]);
    }

    @computed get ariaModal() {
        return asBoolean(this.rawAttributes["aria-modal"]);
    }

    @computed get ariaHasPopup() {
        return asBoolean(this.rawAttributes["aria-haspopup"]?.trim());
    }

    @computed get ariaLevel(): number | undefined {
        return asNumber(this.rawAttributes["aria-level"]?.trim() ?? this.mappedAttributes?.ariaLevel);
    }

    @computed get ariaSetSize(): number | undefined {
        return asNumber(this.rawAttributes["aria-setsize"]?.trim() ?? this.mappedAttributes?.ariaSetSize);
    }

    @computed get ariaPosInSet(): number | undefined {
        return asNumber(this.rawAttributes["aria-posinset"]?.trim() ?? this.mappedAttributes?.ariaPosInSet);
    }

    @computed get ariaValueMin(): number | undefined {
        return asNumber(this.rawAttributes["aria-valuemin"]?.trim() ?? this.mappedAttributes?.ariaValueMin);
    }

    @computed get ariaValueMax(): number | undefined {
        return asNumber(this.rawAttributes["aria-valuemax"]?.trim() ?? this.mappedAttributes?.ariaValueMax);
    }

    @computed get ariaValueNow(): number | undefined {
        return asNumber(this.rawAttributes["aria-valuenow"]?.trim() ?? this.mappedAttributes?.ariaValueNow);
    }

    @computed get ariaValueText(): string | undefined {
        return this.rawAttributes["aria-valuetext"]?.trim();
    }

    @computed get ariaDisabled() {
        return asBoolean(this.rawAttributes["aria-disabled"]?.trim()) ?? this.mappedAttributes?.ariaDisabled;
    }

    @computed get ariaChecked(): "true" | "false" | "mixed" | undefined {
        const value = this.rawAttributes["aria-checked"]?.trim() ?? this.mappedAttributes?.ariaChecked;

        if (!value) {
            return undefined;
        }

        return value === "mixed" || value === "true" ? value : "false";
    }

    @computed get ariaColIndex(): number | undefined {
        return asNumber(this.rawAttributes["aria-colindex"]?.trim() ?? this.mappedAttributes?.colIndex);
    }

    @computed get ariaRowIndex(): number | undefined {
        return asNumber(this.rawAttributes["aria-rowindex"]?.trim() ?? this.mappedAttributes?.rowIndex);
    }

    @computed get ariaColSpan(): number | undefined {
        return asNumber(this.mappedAttributes?.colSpan);
    }

    @computed get ariaRowSpan(): number | undefined {
        return asNumber(this.mappedAttributes?.rowSpan);
    }

    @computed get ariaLive() {
        return this.rawAttributes["aria-live"]?.trim() ?? this.mappedAttributes?.ariaLive ?? "off";
    }

    @computed get ariaExpanded(): boolean | undefined {
        return asBoolean(this.rawAttributes["aria-expanded"]?.trim() ?? this.mappedAttributes?.ariaExpanded);
    }

    @computed get htmlFor() {
        return this.node.htmlTag === "label" ? this.rawAttributes["for"]?.trim() : undefined;
    }

    @computed get htmlName() {
        return this.rawAttributes["name"]?.trim();
    }

    @computed get htmlType() {
        return this.rawAttributes["type"]?.trim();
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

    @computed get htmlSrc() {
        return this.node.htmlTag === "img" ? this.rawAttributes["src"]?.trim() : undefined;
    }

    @computed get htmlHref() {
        return this.node.htmlTag === "a" ? this.rawAttributes["href"]?.trim() : undefined;
    }

    @computed get htmlValue() {
        return this.rawProperties["value"]?.trim();
    }

    @computed get htmlChecked() {
        return this.rawProperties["checked"];
    }

    @computed get headers() {
        return this.mappedAttributes?.headers;
    }
}

export class NodeElement {
    readonly domNode: HTMLElement;
    readonly key: AomKey;
    readonly htmlTag: string;

    @observable isHidden: boolean;
    @observable isFocused: boolean;
    @observable isOpenInSidePanel: boolean;
    @observable containsFocus?: boolean;
    @observable isInline: boolean;
    @observable htmlParent: NodeElement | null = null;
    @observable htmlChildren: NonNullable<AOMElement>[] = [];

    private _rawAttributes = new RawNodeAttributes();
    private _rawProperties = new RawNodeProperties();

    readonly attributes: Aria = new Aria(this);
    readonly relations = new AomNodeRelations(this);
    readonly issuesObj = new AriaIssues(this);

    get id() {
        return this.attributes.id;
    }

    get role() {
        return this.attributes.role;
    }

    get issues() {
        return this.issuesObj.issues;
    }

    getRawAttributes() {
        return this._rawAttributes;
    }

    getRawProperties() {
        return this._rawProperties;
    }

    @computed get hasContent(): boolean {
        if (this.isHidden) {
            return false;
        }

        if (this.attributes.tabindex >= 0) {
            return true;
        }

        const needsAccessibleName: AriaRole[] = ["image", "img"];
        if (needsAccessibleName.includes(this.role)) {
            return this.accessibleName.trim() !== "";
        }

        const trueRoles: AriaRole[] = ["button", "link", "textbox", "radio", "checkbox", "combobox"];

        if (trueRoles.includes(this.role)) {
            return true;
        }

        return this.children.some(x => x.hasContent);
    }

    @computed get ariaParent() {
        return this.relations.ariaOwnedBy.length > 0 ? this.relations.ariaOwnedBy[0] : this.htmlParent;
    }

    @computed get isFirstChild() {
        return this.ariaParent?.children[0] === this;
    }

    @computed get isLastChild() {
        const siblings = this.ariaParent?.children;
        return siblings?.[siblings?.length - 1] === this;
    }

    @computed get children() {
        // const before = new TextElement({key: this.key + '::before', text: this.beforeContent, node: null})
        return [...this.htmlChildren, ...this.relations.ariaOwns].filter(x => x.ariaParent === this);
    }

    @computed get hasCustomAccessibleName(): boolean {
        const isPresentation = this.role === "none" || this.role === "presentation";
        return (
            !!this.relations.labelledBy.length ||
            !!this.attributes.ariaLabel?.trim() ||
            (this.htmlTag === "img" && !isPresentation && this.attributes.htmlAlt != null) ||
            (!isPresentation && !!this.attributes.htmlTitle) ||
            this.attributes.htmlPlaceholder != null
        );
    }

    private isComputingAccessibleName = false;

    // Accessible name is computed according to https://www.w3.org/TR/accname-1.1/#terminology
    get accessibleName(): string {
        try {
            if (this.isComputingAccessibleName) {
                return "";
            }

            this.isComputingAccessibleName = true;

            if (this.isHidden) {
                return "";
            }

            if (this.relations.ariaLabelledBy?.length) {
                return getAccessibleNameOf(this.relations.ariaLabelledBy).trim();
            }

            if (this.attributes.ariaLabel?.trim()) {
                return this.attributes.ariaLabel.trim();
            }

            if (this.relations.labelledBy.length) {
                return getAccessibleNameOf(this.relations.labelledBy).trim();
            }

            const isPresentation = this.role === "none" || this.role === "presentation";
            if (this.htmlTag === "img" && !isPresentation && this.attributes.htmlAlt != null) {
                return this.attributes.htmlAlt;
            }
            if (!isPresentation && !!this.attributes.htmlTitle) {
                return this.attributes.htmlTitle;
            }
            if (this.attributes.htmlPlaceholder != null) {
                return this.attributes.htmlPlaceholder;
            }
            if (
                this.htmlTag === "input" &&
                this.attributes.htmlType &&
                this.attributes.htmlValue &&
                ["submit", "button", "reset"].includes(this.attributes.htmlType)
            ) {
                return this.attributes.htmlValue;
            }

            const children = getAccessibleNameOf(this.children).trim();

            if (children) {
                return children;
            }

            // if (this.attributes.htmlSrc != null) {
            //     return this.attributes.htmlSrc;
            // }
            // if (this.attributes.htmlHref != null) {
            //     return this.attributes.htmlHref;
            // }

            return "";
        } finally {
            this.isComputingAccessibleName = false;
        }
    }

    constructor(node: HTMLElement) {
        this.domNode = node;
        this.htmlTag = node.tagName.toLowerCase();
        this.key = getNodeKey(node);
        this.isHidden = isHidden(node);
        this.isFocused = isFocused(node);
        this.isInline = isInline(node);
        this.isOpenInSidePanel = false;
    }
}

export type AOMElement = TextElement | NodeElement | null | undefined;
