import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

function App() {
  const [wrestlers, setWrestlers] = useState([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");

  const fetchWrestlers = async () => {
    const res = await axios.get(`${API}/wrestlers`);
    setWrestlers(res.data);
  };

  const addWrestler = async () => {
    if (!name || !brand) return;
    await axios.post(`${API}/wrestlers`, { name, brand });
    setName("");
    setBrand("");
    fetchWrestlers();
  };

  const addWin = async (id) => {
    await axios.put(`${API}/wrestlers/${id}/win`);
    fetchWrestlers();
  };

  const addLoss = async (id) => {
    await axios.put(`${API}/wrestlers/${id}/loss`);
    fetchWrestlers();
  };

  const deleteWrestler = async (id) => {
    await axios.delete(`${API}/wrestlers/${id}`);
    fetchWrestlers();
  };

  useEffect(() => {
    fetchWrestlers();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🤼 Pro Wrestling Roster</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          value={name}
          placeholder="Wrestler Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          value={brand}
          placeholder="Brand (e.g., WWE, AEW)"
          onChange={(e) => setBrand(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />
        <button onClick={addWrestler} style={{ marginLeft: "0.5rem" }}>
          Add Wrestler
        </button>
      </div>

      <ul>
        {wrestlers.map((w) => (
          <li key={w.id}>
            <strong>{w.name}</strong> ({w.brand}) — 🏆 {w.wins} | ❌ {w.losses}
            <button onClick={() => addWin(w.id)} style={{ marginLeft: "1rem" }}>+ Win</button>
            <button onClick={() => addLoss(w.id)} style={{ marginLeft: "0.5rem" }}>+ Loss</button>
            <button onClick={() => deleteWrestler(w.id)} style={{ marginLeft: "0.5rem", color: "red" }}>🗑️ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
