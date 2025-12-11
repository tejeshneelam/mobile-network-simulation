import React, { useState } from 'react';

function CreateNetwork() {
  const [networkName, setNetworkName] = useState('');

  const handleCreate = async () => {
    try {
      const res = await fetch('http://localhost:8000/create_network', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: networkName }),
      });
      const data = await res.json();
      alert(data.message || 'Network created');
    } catch {
      alert('Error creating network');
    }
  };

  return (
    <div>
      <h2>Create Network</h2>
      <input
        value={networkName}
        onChange={(e) => setNetworkName(e.target.value)}
        placeholder="Enter network name"
      />
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}

export default CreateNetwork;
