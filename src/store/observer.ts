import Store from "./index";
import traverse from "../AOM/traverse";
import {activeElement, getNodeKey} from "../AOM/utils";
import {AOMElement, NodeElement} from "../AOM/types";
import {runInAction} from "mobx";
import {IdleScheduler} from "./utils";
import ally from 'ally.js';

export default class Observer {
    store: Store = new Store();
    observer: MutationObserver;
    root: AOMElement;
    scheduler: IdleScheduler;
    isSecondaryUpdateScheduled = false;

    constructor(root: HTMLElement) {
        this.root = traverse(root);

        this.store.register(this.root);
        this.store.clearActiveAlerts();

        this.observer = ally.observe.shadowMutations({
            context: root,
            callback: this.onMutation,
            config: {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true,
                attributeOldValue: true
            }
        })

        document.body.addEventListener("blur", this.onBlur, true);
        document.body.addEventListener("focus", this.onFocus, true);
        document.body.addEventListener("input", this.onInput, true);
        document.body.addEventListener("transitionend", this.onTransition, true);
        document.body.addEventListener("animationend", this.onTransition, true);
        document.body.addEventListener("transitioncancel", this.onTransition, true);
        document.body.addEventListener("animationcancel", this.onTransition, true);

        this.scheduler = new IdleScheduler(this.updateSideEffects, 500).start();
    }

    private getAomNode(node: Node | null) {
        return node && this.store.getElement(getNodeKey(node));
    }

    private onFocus = (e: FocusEvent) => {
        const el = this.store.getElement(getNodeKey(e.target as Node));
        this.store.focus(el);
    };

    private onBlur = (e: FocusEvent) => {
        this.store.focus(null);
    };

    private onInput = (event: any) => {
        runInAction("input", () => {
            this.updateNode(event.target);
            this.batchUpdate();
        });
    };

    private onTransition = (event: any) => {
        runInAction("transition", () => {
            this.updateNode(event.target);
            this.batchUpdate();
        });
    };

    private onMutation = (mutations: MutationRecord[]) => {
        runInAction("mutation", () => {
            for (const mutation of mutations) {
                if (this.getAomNode(mutation.target)) {
                    const target = mutation.target as HTMLElement;
                    if (
                        mutation.type === "attributes" &&
                        mutation.oldValue === target.getAttribute(mutation.attributeName ?? "")
                    ) {
                        continue;
                    }

                    this.updateNode(mutation.target);
                }
            }

            this.batchUpdate();
        });
    };

    private previousState = new WeakMap<Node, any>();

    updateSideEffects = () => {
        runInAction("update side effects", () => {
            document.querySelectorAll('input[type="radio"]').forEach((node: any) => {
                if (this.previousState.get(node) !== node.checked) {
                    this.updateNode(node);
                    this.previousState.set(node, node.checked);
                }
            });

            document.querySelectorAll('input[type="checkbox"]').forEach((node: any) => {
                if (this.previousState.get(node) !== node.indeterminate) {
                    this.updateNode(node);
                    this.previousState.set(node, node.indeterminate);
                }
            });

            document.querySelectorAll("input").forEach((node: any) => {
                if (this.previousState.get(node) !== node.value) {
                    this.updateNode(node);
                    this.previousState.set(node, node.value);
                }
            });

            const focusedKey = getNodeKey(activeElement() as Node);
            const focusedEl = this.store.getElement(focusedKey);

            this.store.focus(focusedEl);
            this.batchUpdate();
        });
    };

    private nodesToUpdate: Set<Node> = new Set<Node>();

    private updateNode = (node: Node) => {
        this.nodesToUpdate.add(node);
    };

    private batchUpdate() {
        if (this.nodesToUpdate.size === 0) {
            return;
        }

        const traversedNodes = new Map<Node, AOMElement>();
        const updatedNodes = new Set<AOMElement>();

        this.nodesToUpdate.forEach(node => {
            const aom = traverse(node, traversedNodes);
            if (aom) {
                this.store.update(aom, updatedNodes);
            }
        });
        this.nodesToUpdate.clear();

        if (!this.isSecondaryUpdateScheduled) {
            this.isSecondaryUpdateScheduled = true;
            // @ts-ignore
            window.requestIdleCallback(() => this.runSecondaryUpdates());
        }
    }

    private runSecondaryUpdates() {
        this.isSecondaryUpdateScheduled = false;

        const headings: NodeElement[] = [];
        const headingNodes = document.querySelectorAll('h1, h2, h3, h4, h5, h6, [aria-role=heading]');
        headingNodes.forEach(node => {
            const aomNode = this.getAomNode(node);
            if (aomNode instanceof NodeElement) {
                headings.push(aomNode);
            }
        });
        this.store.updateHeadings(headings)
    };


    disconnect() {
        this.observer.disconnect && this.observer.disconnect();
        this.scheduler.stop();
        document.body.removeEventListener("focus", this.onFocus, true);
        document.body.removeEventListener("blur", this.onBlur, true);
        document.body.removeEventListener("input", this.onInput, true);
        document.body.removeEventListener("transitionend", this.onTransition, true);
        document.body.removeEventListener("animationend", this.onTransition, true);
        document.body.removeEventListener("transitioncancel", this.onTransition, true);
        document.body.removeEventListener("animationcancel", this.onTransition, true);
    }
}
