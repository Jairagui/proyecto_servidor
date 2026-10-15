import type { Request, Response } from 'express';
import { z } from 'zod';
import * as orderService from '../services/order.service';

// Si el cliente manda `price` o `total`, se ignora: el servidor calcula todo.
const createSchema = z.object({
  items: z
    .array(
      z.object({
        _id: z.string().min(1),
        quantity: z.coerce.number().int().min(1, 'La cantidad debe ser al menos 1'),
      }),
    )
    .min(1, 'No hay productos en el pedido'),
});

export async function create(req: Request, res: Response) {
  const { items } = createSchema.parse(req.body);
  const order = await orderService.createOrder(req.user!.id, items);
  res.status(201).json({ message: 'Pedido creado exitosamente', order });
}

export async function myOrders(req: Request, res: Response) {
  res.json(await orderService.getUserOrders(req.user!.id));
}
