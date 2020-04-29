import {
  AOMElement,
  AomKey,
  AomNodeRelations,
  HtmlID,
  NodeElement,
  TextElement,
  Aria,
  Context,
  HtmlTableContext, AriaTableContext
} from "../AOM/types";
import { observable } from "mobx";
import { getMap, reconcileChildListOrder, reconcileFields } from "../AOM/reconcile";

class RelationsForId {
  @observable elementsWithId: NonNullable<NodeElement>[] = [];
  @observable ariaLabelOf: NonNullable<NodeElement>[] = [];
  @observable ariaOwnedBy: NonNullable<NodeElement>[] = [];
  @observable ariaActiveDescendantOf: NonNullable<NodeElement>[] = [];
  @observable htmlLabel: NonNullable<NodeElement>[] = [];
}

export default class Store {
  private keyToAomElement = new Map<AomKey, AOMElement>();
  private idToRelations = new Map<HtmlID, RelationsForId>();

  register(element: AOMElement) {
    if (!element) {
      return;
    }

    if (this.keyToAomElement.has(element.key)) {
      console.error("Duplicated element in registerElement", element);
      throw new Error("Duplicated element in registerElement: " + element.key);
    }

    this.keyToAomElement.set(element.key, element);

    if (element instanceof NodeElement) {
      this.updateReferenceRelations(element, null, element.attributes);
      this.setContext(element, "formContext", "form", "input");
      this.setContext(element, "labelContext", "label", "input", "textarea");
      this.setContext(element, "fieldsetContext", "fieldset", "legend");
      this.setTableContext(element);

      element.htmlChildren.forEach(item => item && this.register(item));
    }

    return element;
  }

  update(update: NonNullable<AOMElement>) {
    const el = this.getElement(update.key);

    if (!el) {
      return;
    }

    if (el instanceof TextElement && update instanceof TextElement) {
      reconcileFields(el, update, ["text"]);
      return;
    }

    if (!(el instanceof NodeElement) || !(update instanceof NodeElement)) {
      console.log(el, update);
      throw new Error("Invariant issue: typeof");
    }

    this.updateReferenceRelations(el, el.attributes, update.attributes);

    reconcileFields(el, update, ["isFocused", "isHidden", "isInline"]);

    reconcileFields(el.getRawAttributes(), update.getRawAttributes());
    reconcileFields(el.getRawProperties(), update.getRawProperties());

    const targetMap = getMap(el.htmlChildren);
    const sourceMap = getMap(update.htmlChildren);

    // Disconnect deleted children from store
    targetMap.forEach(node => {
      if (!sourceMap.has(node.key)) {
        node.htmlParent = null;
        this.unregister(node);
      }
    });

    // Register new children in store
    sourceMap.forEach(node => {
      if (targetMap.has(node.key)) {
        this.update(node);
      } else {
        node.htmlParent = el;
        this.register(node);
      }
    });

    reconcileChildListOrder(el.htmlChildren, update.htmlChildren, this);
  }

  unregister(element: AOMElement) {
    if (!element) {
      return;
    }

    if (element instanceof NodeElement) {
      this.updateReferenceRelations(element, element.attributes, null);
      element.relations.formContext = null;
      element.relations.labelContext = null;
      element.relations.fieldsetContext = null;

      element.htmlChildren.forEach(item => item && this.unregister(item));
    }

    this.keyToAomElement.delete(element.key);
  }

  getElement(key?: AomKey) {
    return key && this.keyToAomElement.get(key);
  }

  private updateReferenceRelations(node: NodeElement, oldAttributes: Aria | null, newAttributes: Aria | null) {
    if (oldAttributes?.id !== newAttributes?.id) {
      if (oldAttributes?.id) {
        removeFrom(this.getRelationsForId(oldAttributes?.id).elementsWithId, node);
        node.relations.ariaLabelOf = [];
        node.relations.ariaActiveDescendantOf = [];
        node.relations.ariaOwnedBy = [];
        node.relations.htmlForLabelledBy = [];
      }

      if (newAttributes?.id) {
        const rel = this.getRelationsForId(newAttributes?.id);

        rel.elementsWithId.push(node);
        node.relations.ariaLabelOf = rel.ariaLabelOf;
        node.relations.ariaActiveDescendantOf = rel.ariaActiveDescendantOf;
        node.relations.ariaOwnedBy = rel.ariaOwnedBy;
        node.relations.htmlForLabelledBy = rel.htmlLabel;
      }
    }

    this.updateSingleReferenceRelation(
      node,
      oldAttributes?.ariaLabelledBy,
      newAttributes?.ariaLabelledBy,
      "ariaLabelledBy",
      "ariaLabelOf"
    );

    this.updateSingleReferenceRelation(
      node,
      oldAttributes?.ariaActiveDescendant,
      newAttributes?.ariaActiveDescendant,
      "ariaActiveDescendants",
      "ariaActiveDescendantOf"
    );

    this.updateSingleReferenceRelation(
      node,
      oldAttributes?.ariaOwns,
      newAttributes?.ariaOwns,
      "ariaOwns",
      "ariaOwnedBy"
    );

    this.updateSingleReferenceRelation(
      node,
      oldAttributes?.htmlFor,
      newAttributes?.htmlFor,
      "htmlForLabelOf",
      "htmlLabel"
    );
  }

  private updateSingleReferenceRelation(
    node: NodeElement,
    oldValue: HtmlID | undefined,
    newValue: HtmlID | undefined,
    ownRelationName: keyof AomNodeRelations,
    foreignRelationName: keyof RelationsForId
  ) {
    if (oldValue === newValue) {
      return;
    }

    if (oldValue) {
      removeFrom(this.getRelationsForId(oldValue)[foreignRelationName], node);
      // @ts-ignore
      node.relations[ownRelationName] = [];
    }

    if (newValue) {
      const relation = this.getRelationsForId(newValue);
      relation[foreignRelationName].push(node);
      // @ts-ignore
      node.relations[ownRelationName] = relation.elementsWithId;
    }
  }

  private getRelationsForId(id: HtmlID): RelationsForId {
    let result = this.idToRelations.get(id);

    if (!result) {
      result = new RelationsForId();
      this.idToRelations.set(id, result);
    }

    return result;
  }

  private setContext(
    node: NodeElement,
    contextName: "formContext" | "labelContext" | "fieldsetContext",
    rootTag: string,
    ...memberTags: string[]
  ) {
    if (node.htmlTag === rootTag) {
      node.relations[contextName] = new Context(node);
    } else if (!node.htmlParent) {
      node.relations[contextName] = new Context(null);
    } else {
      node.relations[contextName] = node.htmlParent.relations[contextName];
    }

    if (memberTags.includes(node.htmlTag)) {
      node.relations[contextName]?.descendants.push(node);
    }
  }

  private setTableContext(node: NodeElement) {
    if (node.htmlTag === "table") {
      node.relations.tableContext = new HtmlTableContext(node);
    } else if (node.role === "table" || node.role === "grid") {
      node.relations.tableContext = new AriaTableContext(node);
    } else if (node.htmlParent) {
      node.relations.tableContext = node.htmlParent.relations.tableContext;
    }
  }
}

const removeFrom = (array: NodeElement[] | undefined, node: NodeElement) => {
  if (!array) return;
  const index = array.indexOf(node);

  if (index !== -1) {
    array.splice(index, 1);
  }
};
