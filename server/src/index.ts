import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';
import supabase from './config/supabaseClient.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  created_at: z.string().nullable(),
});

const OrderSchema = z.object({
  id: z.number(),
  user_id: z.string().uuid().nullable(),
  item_name: z.string(),
  order_date: z.string().nullable(),
});

app.get('/api/items', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      status: 'success',
      data: z.array(ItemSchema).parse(data),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('order_date', { ascending: false });

    if (error) throw error;

    res.json({
      status: 'success',
      data: z.array(OrderSchema).parse(data),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Test App Server running on http://localhost:${PORT}`);
});
