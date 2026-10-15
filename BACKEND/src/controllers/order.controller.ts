import type { Request, Response } from 'express';
import { z } from 'zod';
import * as orderService from '../services/order.service';

export const cartSchema = z
  .array(
    z.object({
      _id: z.string().min(1),
      quantity: z.coerce.number().int().min(1, 'La cantidad debe ser al menos 1'),
      size: z.union([z.string(), z.array(z.string())]).optional(),
    }),
  )
  .min(1, 'No hay productos en el pedido');

// El campo `total` que manda el frontend se ignora: el total lo calcula el servidor.
const createSchema = z.object({ items: cartSchema });

export async function create(req: Request, res: Response) {
  const { items } = createSchema.parse(req.body);
  const order = await orderService.createOrder(req.user!.id, items);
  res.status(201).json({ message: 'Pedido creado exitosamente', order });
}

export async function myOrders(req: Request, res: Response) {
  res.json(await orderService.getUserOrders(req.user!.id));
}
