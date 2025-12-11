import React, { useState } from 'react';

function MakeCall() {
  const [caller, setCaller] = useState('');
  const [receiver, setReceiver] = useState('');

  const handleCall = async () => {
    try {
      const res = await fetch('http://localhost:8000/make_call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caller_number: caller, receiver_number: receiver }),
      });
      const data = await res.json();
      alert(data.message);
    } catch {
      alert('Error making call');
    }
  };

  return (
    <div>
      <h2>Make Call</h2>
      <input placeholder="Caller Number" value={caller} onChange={(e) => setCaller(e.target.value)} />
      <input placeholder="Receiver Number" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
      <button onClick={handleCall}>Call</button>
    </div>
  );
}

export default MakeCall;
