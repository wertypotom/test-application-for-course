import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

interface Item {
  id: number;
  name: string;
  price: number;
}
interface Order {
  id: number;
  item_name: string;
  order_date: string;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Fetch Items
    axios
      .get('http://localhost:4000/api/items')
      .then((res) => setItems(res.data))
      .catch(console.error);

    // Fetch Orders
    axios
      .get('http://localhost:4000/api/orders')
      .then((res) => setOrders(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className='container'>
      <h1>Store Inventory & Orders</h1>

      <section>
        <h2>Items In Stock</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>${item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Order History</h2>
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              Order #{order.id}: {order.item_name} (
              {new Date(order.order_date).toLocaleDateString()})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
