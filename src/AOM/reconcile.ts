import { AOMElement, AomKey, NodeElement, TextElement } from "./types";
import { diff, patch } from "jsondiffpatch";
import Store from "../store";

export function getMap(list: AOMElement[]): Map<string, NonNullable<AOMElement>> {
  const map = new Map<AomKey, NonNullable<AOMElement>>();
  list.forEach(x => x && map.set(x.key, x));
  return map;
}

export function reconcileFields<T>(
  target: T,
  source: T,
  fields: (keyof T)[] = Object.keys(target) as any
) {
  for (const field of fields) {
    if (target[field] !== source[field]) {
      target[field] = source[field];
    }
  }
}

export function reconcileChildListOrder<T>(
  targetList: NonNullable<AOMElement>[],
  sourceList: NonNullable<AOMElement>[],
  store: Store
) {
  const targetKeys = targetList.map(x => x.key);
  const sourceKeys = sourceList.map(x => x.key);

  const delta = diff(targetKeys, sourceKeys);
  if (!delta) {
    return;
  }

  // Use the jsondiffpatch to patch the array. As the library operates
  // on strings, map all operations on the string array to the
  // array of AOMElements
  patch(
    {
      splice(start: number, deleteCount: number, ...items: AomKey[]) {
        const aomItems = items.map(key => {
          const item = store.getElement(key);
          if (!item) {
            throw new Error("Unexpected empty item");
          }
          return item;
        });
        targetList.splice(start, deleteCount, ...aomItems);
        return targetKeys.splice(start, deleteCount, ...items);
      }
    },
    delta
  );
}
