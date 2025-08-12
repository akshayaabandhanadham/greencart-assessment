import React, { useEffect, useState } from "react";
import API from "../api";

export default function SimulationHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/simulation-history");
        console.log("📜 History fetched:", res.data);
        setHistory(res.data);
      } catch (err) {
        console.error("❌ Error fetching history:", err.response?.data || err.message);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Simulation History</h2>

      {history.length === 0 ? (
        <p>No history found. Run a simulation first.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Drivers Used</th>
              <th>Total Profit (₹)</th>
              <th>Efficiency Score</th>
              <th>On Time Deliveries</th>
              <th>Late Deliveries</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row) => (
              <tr key={row.id}>
                <td>{row.drivers_used}</td>
                <td>{row.total_profit.toFixed(2)}</td>
                <td>{row.efficiency_score}</td>
                <td>{row.on_time_deliveries}</td>
                <td>{row.late_deliveries}</td>
                <td>{new Date(row.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
