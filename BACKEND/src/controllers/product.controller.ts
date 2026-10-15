import type { Request, Response } from 'express';
import { z } from 'zod';
import * as productService from '../services/product.service';

const productSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo'),
  // El cliente puede mandar "L" o ["S","M"]
  size: z.union([z.string(), z.array(z.string())]).transform((s) => (Array.isArray(s) ? s : [s])),
});

export async function list(_req: Request, res: Response) {
  res.json(await productService.listProducts());
}

export async function get(req: Request, res: Response) {
  res.json(await productService.getProduct(req.params.id as string));
}

export async function create(req: Request, res: Response) {
  res.status(201).json(await productService.createProduct(productSchema.parse(req.body)));
}
