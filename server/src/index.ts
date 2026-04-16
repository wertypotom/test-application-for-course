import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';
import supabase from './config/supabaseClient.js';
import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

extendZodWithOpenApi(z);

const app = express();
app.use(cors());
app.use(express.json());

const registry = new OpenAPIRegistry();

const ItemSchema = registry.register(
  'Item',
  z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    created_at: z.string().nullable(),
  }),
);

const OrderSchema = registry.register(
  'Order',
  z.object({
    id: z.number(),
    user_id: z.string().uuid().nullable(),
    item_name: z.string(),
    order_date: z.string().nullable(),
  }),
);

registry.registerPath({
  method: 'get',
  path: '/api/items',
  description: 'Get all items',
  summary: 'Get all items',
  responses: {
    200: {
      description: 'Object with items data',
      content: {
        'application/json': {
          schema: z.object({
            status: z.string(),
            data: z.array(ItemSchema),
          }),
        },
      },
    },
  },
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

registry.registerPath({
  method: 'get',
  path: '/api/orders',
  description: 'Get all orders',
  summary: 'Get all orders',
  responses: {
    200: {
      description: 'Object with orders data',
      content: {
        'application/json': {
          schema: z.object({
            status: z.string(),
            data: z.array(OrderSchema),
          }),
        },
      },
    },
  },
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

const generator = new OpenApiGeneratorV3(registry.definitions);
const document = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Test App API',
    description: 'Auto-generated API docs from Zod',
  },
  servers: [{ url: 'http://localhost:4000' }],
});

// Expose internal JSON structure for openapi-typescript code generation
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(document);
});

// Expose HTML Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(document));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Test App Server running on http://localhost:${PORT}`);
});
