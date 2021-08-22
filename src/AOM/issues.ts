import {NodeElement} from "./types";
import {computed, observable} from "mobx";
import {isDescriptiveText} from "./utils";

type AriaIssue = {
    summary: string;
    description?: string;
    links?: string[];
}

export class AriaIssues {
    @observable node: NodeElement;

    constructor(node: NodeElement) {
        this.node = node;
    }

    @computed get issues(): AriaIssue[] {
        const node = this.node;
        const attrs = this.node.attributes;
        const relations = this.node.relations;
        const result: AriaIssue[] = [];

        const check = (role: string, condition: () => boolean, issue: string | AriaIssue | (() => AriaIssue)) => {
            if (node.role === role && condition()) {
                if (typeof issue === "string") result.push({summary: issue});
                else if (typeof issue === "function") result.push(issue());
                else result.push(issue);
            }
        }

        check("heading", () => !attrs.ariaLevel || !(attrs.ariaLevel >= 1 && attrs.ariaLevel <= 6), `Aria level is invalid: ${attrs.ariaLevel}`)
        check("heading", () => relations.previousHeading === null && attrs.ariaLevel != 1, `First heading on the page should be h1 but is h${attrs.ariaLevel}`)
        check("heading", () => {
            const previousLevel = relations.previousHeading?.attributes.ariaLevel;
            const currentLevel = attrs.ariaLevel;
            return (previousLevel != null && currentLevel != null && currentLevel - previousLevel > 1)
        }, `Nonconsecutive heading level used (h${relations.previousHeading?.attributes.ariaLevel} -> h${attrs.ariaLevel})`)

        check("img", () => !node.hasCustomAccessibleName == undefined, 'This image does not have accessible name')
        check("link", () => !node.accessibleName.trim(), "Link accessible name is empty")
        check("link", () => !!node.accessibleName.trim() && !isDescriptiveText(node.accessibleName), "Link accessible name is unclear")

        return result;
    }
}