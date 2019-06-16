# react-use-indexeddb

Redux のように IndexedDB を使うための React Hooks。  
[Dexie](https://dexie.org/)を使用します。

## Install

```bash
yarn add @hako1912/use-indexeddb
```

## Usage

エンティティ型を定義します。

```typescript
// Person.ts
import { Entity } from "@hako1912/react-use-indexeddb";

export type Person = {
  name: string;
  age: number;
} & Entity;
```

`Dexie`の Database オブジェクトを作ります。

```typescript
// Database.ts
import Dexie from "dexie";
import { Person } from "./Person";

class Database extends Dexie {
  persons: Dexie.Table<Person, string>;

  constructor() {
    super("Database");

    this.version(1).stores({
      persons: "&id, name, age"
    });

    this.persons = this.table("persons");
  }
}

export const db = new Database();
```

詳細:  
https://dexie.org/docs/Typescript

React コンポーネントの中で`useIndexedDb`を呼びます。  
`useIndexedDb`はデータのリストとデータの操作関数を返します。

```tsx
import { useIndexedDb } from "@hako1912/react-use-indexeddb";

const myComponent = () => {
  const [persons, insertPerson, updatePerson, deletePerson] = useIndexedDb(
    db,
    db.persons
  );

  return (
    <>
      {persons.map(person => (
        <p key={person.id}>{person.name}</p>
      ))}
    </>
  );
};
```
