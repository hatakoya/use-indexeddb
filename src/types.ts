// TypeScript3.5で標準サポートされたら消す
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
