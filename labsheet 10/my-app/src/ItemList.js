import React, { useState } from "react";

function ItemList() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  // Add item
  const addItem = () => {
    if (input.trim() === "") return;

    const newItem = {
      id: Date.now(),
      text: input
    };

    setItems([...items, newItem]);
    setInput("");
  };

  // Remove item
  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h2>Item List</h2>

      <input
        type="text"
        placeholder="Enter item"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={addItem}>Add</button>

      {items.length === 0 ? (
        <p>No items available</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.text}
              <button onClick={() => removeItem(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ItemList;