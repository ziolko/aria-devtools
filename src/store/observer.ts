import Store from "./index";
import traverse from "../AOM/traverse";
import { getNodeKey } from "../AOM/utils";
import { AOMElement, NodeElement } from "../AOM/types";
import { action, runInAction } from "mobx";

export default class Observer {
  store: Store = new Store();
  observer: MutationObserver;
  root: AOMElement;

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
  }

  private getAomNode(node: Node | null) {
    return node && this.store.getElement(getNodeKey(node));
  }

  private onFocus = (e: FocusEvent) => {
    const el = this.store.getElement(getNodeKey(e.target as Node));
    if (el instanceof NodeElement) {
      el.isFocused = true;
    }
  };

  private onBlur = (e: FocusEvent) => {
    const el = this.store.getElement(getNodeKey(e.target as Node));
    if (el instanceof NodeElement) {
      el.isFocused = false;
    }
  };

  private onInput = (event: any) => {
    runInAction("input", () => {
      if (event.target?.name?.trim()) {
        document
          .getElementsByName(event.target.name)
          .forEach(node => this.updateNode(node));
      } else {
        this.updateNode(event.target);
      }
    });
  };

  private onMutation = (mutations: MutationRecord[]) => {
    runInAction("mutation", () => {
      for (const mutation of mutations) {
        if (this.getAomNode(mutation.target)) {
          this.updateNode(mutation.target);
        }
      }
    });
  };

  updateNode(node: Node) {
    const newAOM = traverse(node);

    if (newAOM) {
      this.store.update(newAOM);
    }
  }

  disconnect() {
    this.observer.disconnect();
    document.body.removeEventListener("focus", this.onFocus, true);
    document.body.removeEventListener("blur", this.onBlur, true);
    document.body.removeEventListener("input", this.onInput, true);
  }
}
