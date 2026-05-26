import "react";

// `inert` only ships in @types/react's experimental typings until React 19.
// Augment the stable JSX attributes so tests can use it without @ts-ignore.
declare module "react" {
  interface HTMLAttributes<T> {
    inert?: string | boolean;
  }
}
