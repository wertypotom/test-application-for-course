import { z } from 'zod';
import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';

// Extend zod globally before any parsing
extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

export const ItemSchema = registry.register(
  'Item',
  z.object({
    id: z.number(),
    item_name: z.string(),
    price: z.number(),
    created_at: z.string().nullable(),
  }),
);

export const OrderSchema = registry.register(
  'Order',
  z.object({
    id: z.number(),
    user_id: z.string().uuid().nullable(),
    itemName: z.string(),
    order_date: z.string().nullable(),
  }),
);

export const UserSchema = registry.register(
  'User',
  z.object({
    id: z.number(),
    name: z.string(),
    surname: z.string(),
    age: z.number(),
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
