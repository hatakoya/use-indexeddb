import Dexie from "dexie";

export interface Entity {
  id: string;
}

export const useIndexedDb: <E extends Entity>(
  db: Dexie,
  table: Dexie.Table<E, string>,
  filter?: (entity: E) => boolean
) => [
  E[],
  EntityInsertFunction<E>,
  EntityUpdateFunction<E>,
  EntityDeleteFunction
];

type EntityInsertFunction<E extends Entity> = (
  entity: Omit<E, "id"> & { id?: string }
) => void;
type EntityUpdateFunction<E extends Entity> = (
  key: string,
  mod:
    | Partial<Omit<E, "id"> & { id?: string }>
    | ((prev: E) => Partial<Omit<E, "id"> & { id?: string }>)
) => void;
type EntityDeleteFunction = (id: string) => void;
