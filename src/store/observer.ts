import Store from "./index";
import traverse from "../AOM/traverse";
import { getNodeKey } from "../AOM/utils";
import { AOMElement } from "../AOM/types";
import { runInAction } from "mobx";
import { IdleScheduler } from "./utils";

export default class Observer {
  store: Store = new Store();
  observer: MutationObserver;
  root: AOMElement;
  scheduler: IdleScheduler;

  constructor(root: HTMLElement) {
    this.root = traverse(root);

    this.store.register(this.root);
    this.observer = new MutationObserver(this.onMutation);
    this.observer.observe(root, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });

    document.body.addEventListener("blur", this.onBlur, true);
    document.body.addEventListener("focus", this.onFocus, true);
    document.body.addEventListener("input", this.onInput, true);
    document.body.addEventListener("transitionend", this.onInput, true);

    this.scheduler = new IdleScheduler(this.updateSideEffects, 100).start();
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

  private onMutation = (mutations: MutationRecord[]) => {
    runInAction("mutation", () => {
      for (const mutation of mutations) {
        if (this.getAomNode(mutation.target)) {
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

      const focusedKey = getNodeKey(document.activeElement as Node);
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
    const traversedNodes = new Map<Node, AOMElement>();
    const updatedNodes = new Set<AOMElement>();

    this.nodesToUpdate.forEach(node => {
      const aom = traverse(node, traversedNodes);
      if (aom) {
        this.store.update(aom, updatedNodes);
      }
    });

    this.nodesToUpdate.clear();
  }

  disconnect() {
    this.observer.disconnect();
    this.scheduler.stop();
    document.body.removeEventListener("focus", this.onFocus, true);
    document.body.removeEventListener("blur", this.onBlur, true);
    document.body.removeEventListener("input", this.onInput, true);
    document.body.removeEventListener("transitionend", this.onInput, true);
  }
}
