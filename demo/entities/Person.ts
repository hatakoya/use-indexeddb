import { EntityBase } from "../../src/EntityBase";

export type Person = {
  name: string;
  age: number;
} & EntityBase;
