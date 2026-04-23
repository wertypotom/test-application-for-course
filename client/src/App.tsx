import { useEffect, useState } from 'react';
import { apiClient } from './api/client';
import type { components } from './api/types.d';
import './App.css';

type Item = components['schemas']['Item'];
type Order = components['schemas']['Order'];

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // We launch async operations to use openapi-fetch
    const loadData = async () => {
      // apiClient.GET guarantees IDE auto-completion for '/api/items' and extracts the typed payload
      const { data: itemData, error: itemError } =
        await apiClient.GET('/api/items');
      if (itemData?.data) {
        setItems(itemData.data);
      } else if (itemError) {
        console.error(itemError);
      }

      const { data: orderData, error: orderError } =
        await apiClient.GET('/api/orders');
      if (orderData?.data) {
        setOrders(orderData.data);
      } else if (orderError) {
        console.error(orderError);
      }
    };

    loadData();
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
                <td>${item.item_price_number}</td>
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
              Order #{order.id}: {order.order_item_name} (
              {new Date(order.order_date ?? '').toLocaleDateString()})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
