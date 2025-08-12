import React, { useEffect, useState } from "react";
import API from "../api";

function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({
    distance_km: "",
    traffic_level: "",
    base_time_min: ""
  });

  useEffect(() => {
    API.get("/routes")
      .then((res) => setRoutes(res.data))
      .catch((err) => console.error(err));
  }, []);

  const addRoute = async () => {
    try {
      const res = await API.post("/routes", form);
      setRoutes([...routes, res.data]);
      setForm({ distance_km: "", traffic_level: "", base_time_min: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add route");
    }
  };

  return (
    <div>
      <h2>Routes</h2>
      <input
        placeholder="Distance (km)"
        value={form.distance_km}
        onChange={(e) => setForm({ ...form, distance_km: e.target.value })}
      />
      <input
        placeholder="Traffic Level"
        value={form.traffic_level}
        onChange={(e) => setForm({ ...form, traffic_level: e.target.value })}
      />
      <input
        placeholder="Base Time (min)"
        value={form.base_time_min}
        onChange={(e) => setForm({ ...form, base_time_min: e.target.value })}
      />
      <button onClick={addRoute}>Add Route</button>

      <ul>
        {routes.map((route) => (
          <li key={route.id}>
            {route.distance_km} km - {route.traffic_level} - {route.base_time_min} min
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoutesPage;
