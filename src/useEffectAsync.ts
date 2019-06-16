import { DependencyList, useEffect } from "react";

export const useEffectAsync = (
  effect: () => any,
  deps?: DependencyList
): void =>
  useEffect(() => {
    effect();
  }, deps);
