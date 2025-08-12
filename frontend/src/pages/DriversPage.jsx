import React, { useEffect, useState } from "react";
import API from "../api";

function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    API.get("/drivers")
      .then((res) => setDrivers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const addDriver = async () => {
    try {
      const res = await API.post("/drivers", { name });
      setDrivers([...drivers, res.data]);
      setName("");
    } catch (err) {
      console.error(err);
      alert("Failed to add driver");
    }
  };

  return (
    <div>
      <h2>Drivers</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Driver Name"
      />
      <button onClick={addDriver}>Add Driver</button>
      <ul>
        {drivers.map((driver) => (
          <li key={driver.id}>{driver.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default DriversPage;
