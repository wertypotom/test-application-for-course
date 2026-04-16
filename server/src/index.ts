import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import supabase from './config/supabaseClient.js';
import { ItemSchema, OrderSchema } from './schemas.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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

// Statically serve the pre-built openapi payload for local developers
const docsPath = path.resolve(process.cwd(), 'openapi.json');
if (fs.existsSync(docsPath)) {
  const document = JSON.parse(fs.readFileSync(docsPath, 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(document));
  app.get('/api-docs.json', (req, res) => res.json(document));
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Test App Server running on http://localhost:${PORT}`);
});
