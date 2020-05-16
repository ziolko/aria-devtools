import { AOMElement, AomKey } from "./types";

export function getMap(list: AOMElement[]): Map<string, NonNullable<AOMElement>> {
  const map = new Map<AomKey, NonNullable<AOMElement>>();
  list.forEach(x => x && map.set(x.key, x));
  return map;
}

export function reconcileFields<T>(target: T, source: T, fields: (keyof T)[] = Object.keys(target) as any) {
  for (const field of fields) {
    if (target[field] !== source[field]) {
      target[field] = source[field];
    }
  }
}
