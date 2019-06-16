import React, { useState } from "react";
import { useIndexedDb } from "../src/useIndexedDb";
import { db } from "./Database";

const Demo = () => {
  const [persons, insertPerson, updatePerson, deletePerson] = useIndexedDb(
    db,
    db.persons
  );
  const [name, setName] = useState("01a3e11d-b4a5-4f2f-aa80-9885c2bd74d5");
  const [age, setAge] = useState(99);

  const handleAddButtonClick = () => {
    insertPerson({ name, age });
  };
  const handleUpdateButtonClick = () => {
    console.log("update");
    updatePerson(name, prev => ({ ...prev, age: prev.age + 1 }));
    updatePerson(name, prev => ({ ...prev, age: prev.age + 1 }));
    updatePerson(name, prev => ({ ...prev, age: prev.age + 1 }));
  };
  const handleDeleteButtonClick = () => {
    deletePerson(name);
  };

  return (
    <div>
      <input
        type="text"
        placeholder=""
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder=""
        value={age}
        onChange={e => setAge(Number(e.target.value))}
      />
      <button onClick={handleAddButtonClick}>Add</button>
      <button onClick={handleUpdateButtonClick}>Update</button>
      <button onClick={handleDeleteButtonClick}>Delete</button>
      {persons.map(person => (
        <p key={person.id}>
          {person.name}, {person.age}
        </p>
      ))}
    </div>
  );
};
export default Demo;
