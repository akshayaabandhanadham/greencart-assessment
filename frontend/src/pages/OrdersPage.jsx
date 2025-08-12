import React, { useEffect, useState } from "react";
import API from "../api";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    value_rs: "",
    route_id: "",
    delivery_time: ""
  });

  useEffect(() => {
    API.get("/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  const addOrder = async () => {
    try {
      const res = await API.post("/orders", form);
      setOrders([...orders, res.data]);
      setForm({ value_rs: "", route_id: "", delivery_time: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add order");
    }
  };

  return (
    <div>
      <h2>Orders</h2>
      <input
        placeholder="Value (Rs)"
        value={form.value_rs}
        onChange={(e) => setForm({ ...form, value_rs: e.target.value })}
      />
      <input
        placeholder="Route ID"
        value={form.route_id}
        onChange={(e) => setForm({ ...form, route_id: e.target.value })}
      />
      <input
        placeholder="Delivery Time"
        value={form.delivery_time}
        onChange={(e) => setForm({ ...form, delivery_time: e.target.value })}
      />
      <button onClick={addOrder}>Add Order</button>

      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            ₹{order.value_rs} - Route {order.route_id} - {order.delivery_time}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrdersPage;
