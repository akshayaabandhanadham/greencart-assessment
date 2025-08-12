import React, { useState } from "react";
import API from "../api";

export default function SimulationPage() {
  const [driversAvailable, setDriversAvailable] = useState("");
  const [startTime, setStartTime] = useState("");
  const [maxHoursPerDay, setMaxHoursPerDay] = useState("");
  const [result, setResult] = useState(null);

  const runSimulation = async () => {
    try {
      const res = await API.post("/simulate", {
        driversAvailable,
        startTime,
        maxHoursPerDay
      });

      console.log("Simulation result:", res.data);
      setResult(res.data); // ✅ Update state with backend response
    } catch (err) {
      console.error("Simulation failed:", err.response?.data || err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Run Simulation</h2>

      <div>
        <label>Drivers Available:</label>
        <input
          type="number"
          value={driversAvailable}
          onChange={(e) => setDriversAvailable(e.target.value)}
        />
      </div>

      <div>
        <label>Start Time:</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      <div>
        <label>Max Hours per Day:</label>
        <input
          type="number"
          value={maxHoursPerDay}
          onChange={(e) => setMaxHoursPerDay(e.target.value)}
        />
      </div>

      <button onClick={runSimulation}>Simulate</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Total Profit: ₹{result.total_profit.toFixed(2)}</h3>
          <h3>Efficiency Score: {result.efficiency_score}</h3>
          <h3>On Time Deliveries: {result.on_time_deliveries}</h3>
          <h3>Late Deliveries: {result.late_deliveries}</h3>
        </div>
      )}
    </div>
  );
}
