import React, { useState } from "react";
import API from "../api";

export default function SimulationPage() {
  const [driversAvailable, setDriversAvailable] = useState("");
  const [startTime, setStartTime] = useState("");
  const [maxHoursPerDay, setMaxHoursPerDay] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const runSimulation = async () => {
    try {
      setError("");
      const response = await API.post("/simulate", {
        driversAvailable,
        startTime,
        maxHoursPerDay
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setError("Unauthorized. Please log in again.");
      } else {
        setError("Error running simulation. Check console for details.");
      }
    }
  };

  return (
    <div>
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
        <label>Max Hours/Day:</label>
        <input
          type="number"
          value={maxHoursPerDay}
          onChange={(e) => setMaxHoursPerDay(e.target.value)}
        />
      </div>
      <button onClick={runSimulation}>Run</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div>
          <h3>Simulation Results</h3>
          <p>Total Profit: ₹{result.totalProfit}</p>
          <p>Efficiency Score: {result.efficiencyScore}%</p>
          <p>On-time Deliveries: {result.onTimeDeliveries}</p>
          <p>Late Deliveries: {result.lateDeliveries}</p>
        </div>
      )}
    </div>
  );
}
