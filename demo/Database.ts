import Dexie from "dexie";
import { Person } from "./entities/Person";

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
