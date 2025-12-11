import React, { useState } from 'react';

function AddUser() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [x, setX] = useState('');
  const [y, setY] = useState('');

  const handleAdd = async () => {
    try {
      const res = await fetch('http://localhost:8000/add_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone_number: phone, x: Number(x), y: Number(y) }),
      });
      const data = await res.json();
      alert(data.message);
    } catch {
      alert('Error adding user');
    }
  };

  return (
    <div>
      <h2>Add User</h2>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input placeholder="X" value={x} onChange={(e) => setX(e.target.value)} />
      <input placeholder="Y" value={y} onChange={(e) => setY(e.target.value)} />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default AddUser;
