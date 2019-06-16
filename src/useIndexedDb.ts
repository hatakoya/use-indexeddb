import Dexie from "dexie";
import { useEffect, useRef } from "react";
import {
  CreatingListener,
  DeletingListener,
  UpdatingListener
} from "./dexieListeners";
import { Omit } from "./types";
import { useEffectAsync } from "./useEffectAsync";
import { useRefState } from "./useRefState";
import uuid = require("uuid");

type Entity = { id: string };

export const useIndexedDb = <E extends Entity>(
  db: Dexie,
  table: Dexie.Table<E, string>,
  filter: (entity: E) => boolean = () => true
): [
  E[],
  EntityInsertFunction<E>,
  EntityUpdateFunction<E>,
  EntityDeleteFunction
] => {
  const [entities, entitiesRef, setEntities] = useRefState<E[]>([]);

  const onCreatingRef = useRef<CreatingListener<E, string>>();
  const onUpdatingRef = useRef<UpdatingListener<E, string>>();
  const onDeletingRef = useRef<DeletingListener<E, string>>();

  useEffectAsync(async () => {
    // set initial value
    setEntities(await table.filter(filter).toArray());

    onCreatingRef.current = (key, obj, transaction) => {
      console.log(`[IndexedDB] onCreating... key=${key}, obj=${obj}`);
      setEntities([...entitiesRef.current, obj]);
    };
    onUpdatingRef.current = (mod, key, obj, transaction) => {
      console.log(
        `[IndexedDB] onUpdating... key=${key}, mod=${JSON.stringify(
          mod
        )}, entities=${JSON.stringify(entitiesRef.current)}`
      );
      const copiedEntities = entitiesRef.current.slice();
      let updateTarget = copiedEntities.find(it => it.id === key);
      if (!updateTarget) {
        console.error(
          "update target does not found.",
          key,
          copiedEntities,
          obj
        );
        return;
      }
      for (let propName in mod) {
        (updateTarget as any)[propName] = (mod as any)[propName];
      }
      setEntities(copiedEntities);
    };
    onDeletingRef.current = (key, obj, transaction) => {
      console.log(`[IndexedDB] onDeleting... key=${key}`);
      setEntities(entitiesRef.current.filter(entity => entity.id !== key));
    };

    table.hook("creating", onCreatingRef.current);
    table.hook("updating", onUpdatingRef.current);
    table.hook("deleting", onDeletingRef.current);
    return () => {
      console.log("unmounted.");
      if (onCreatingRef.current) {
        table.hook("creating").unsubscribe(onCreatingRef.current);
      }
      if (onUpdatingRef.current) {
        table.hook("updating").unsubscribe(onUpdatingRef.current);
      }
      if (onDeletingRef.current) {
        table.hook("deleting").unsubscribe(onDeletingRef.current);
      }
    };
  }, []);

  useEffect(
    () => () => {
      console.log("unmount........");
      if (onCreatingRef.current) {
        table.hook("creating").unsubscribe(onCreatingRef.current);
      }
      if (onUpdatingRef.current) {
        table.hook("updating").unsubscribe(onUpdatingRef.current);
      }
      if (onDeletingRef.current) {
        table.hook("deleting").unsubscribe(onDeletingRef.current);
      }
    },
    []
  );

  const insertEntity: EntityInsertFunction<E> = async entity => {
    if (entity.id) {
      await table.add(entity as E);
    } else {
      await table.add({ ...entity, id: uuid.v4() } as E);
    }
  };

  const updateEntity: EntityUpdateFunction<E> = async (key, mod) => {
    if (typeof mod === "function") {
      // トランザクションなしだと連続で呼んだときにprevが常に最初にupdateEntityを呼んだ時点の値になってしまう
      // 更新が終わるまでは次の更新を待機するということ
      db.transaction("rw", table, async () => {
        const prev = await table.get(key);
        if (prev == null) {
          console.error(
            `update target not found in updateEntity(). key=${key}`
          );
          return;
        }
        const modValue = mod(prev);
        console.log(`[IndexedDB] update. mod=${JSON.stringify(modValue)}`);
        await table.update(key, modValue);

        // デバッグ用
        const updatedVal = await table.get(key);
        console.log(
          `[IndexedDB] update finish. newVal=${JSON.stringify(updatedVal)}`
        );
      });
    } else {
      await table.update(key, mod);
    }
  };
  const deleteEntity: EntityDeleteFunction = async id => await table.delete(id);

  return [entities, insertEntity, updateEntity, deleteEntity];
};

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
