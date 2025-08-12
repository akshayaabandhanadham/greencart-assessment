// src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SimulationPage from "./pages/SimulationPage";
import DriversPage from "./pages/DriversPage";
import RoutesPage from "./pages/RoutesPage";
import OrdersPage from "./pages/OrdersPage";
import SimulationHistory from "./pages/SimulationHistory";
import ProtectedRoute from "./ProtectedRoute"; // ✅ Added import

function App() {
  return (
    <div>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ margin: "0 10px" }}>Login</Link>
        <Link to="/drivers" style={{ margin: "0 10px" }}>Drivers</Link>
        <Link to="/routes" style={{ margin: "0 10px" }}>Routes</Link>
        <Link to="/orders" style={{ margin: "0 10px" }}>Orders</Link>
        <Link to="/simulation" style={{ margin: "0 10px" }}>Simulation</Link>
        <Link to="/history" style={{ margin: "0 10px" }}>History</Link>
      </nav>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/drivers"
          element={<ProtectedRoute><DriversPage /></ProtectedRoute>}
        />
        <Route
          path="/routes"
          element={<ProtectedRoute><RoutesPage /></ProtectedRoute>}
        />
        <Route
          path="/orders"
          element={<ProtectedRoute><OrdersPage /></ProtectedRoute>}
        />
        <Route
          path="/simulation"
          element={<ProtectedRoute><SimulationPage /></ProtectedRoute>}
        />
        <Route
          path="/history"
          element={<ProtectedRoute><SimulationHistory /></ProtectedRoute>}
        />
      </Routes>
    </div>
  );
}

export default App;
