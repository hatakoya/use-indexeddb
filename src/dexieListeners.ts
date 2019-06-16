import Dexie from "dexie";

export type CreatingListener<T, Key> = (
  this: Dexie.CreatingHookContext<T, Key>,
  primKey: Key,
  obj: T,
  transaction: Dexie.Transaction
) => any;

export type UpdatingListener<T, Key> = (
  this: Dexie.UpdatingHookContext<T, Key>,
  modifications: Object,
  primKey: Key,
  obj: T,
  transaction: Dexie.Transaction
) => any;

export type DeletingListener<T, Key> = (
  this: Dexie.DeletingHookContext<T, Key>,
  primKey: Key,
  obj: T,
  transaction: Dexie.Transaction
) => any;
