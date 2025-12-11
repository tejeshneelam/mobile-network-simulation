import React, { useState } from 'react';

function AddTower() {
  const [name, setName] = useState('');
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [height, setHeight] = useState('');

  const handleAdd = async () => {
    try {
      const res = await fetch('http://localhost:8000/add_tower', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, x: Number(x), y: Number(y), height: Number(height) }),
      });
      const data = await res.json();
      alert(data.message);
    } catch {
      alert('Error adding tower');
    }
  };

  return (
    <div>
      <h2>Add Tower</h2>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="X" value={x} onChange={(e) => setX(e.target.value)} />
      <input placeholder="Y" value={y} onChange={(e) => setY(e.target.value)} />
      <input placeholder="Height" value={height} onChange={(e) => setHeight(e.target.value)} />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default AddTower;
