import type { Request, Response } from 'express';
import { z } from 'zod';
import * as productService from '../services/product.service';

const productSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().optional(),
  availability: z.boolean().optional(),
  stock: z.coerce.number().int().min(0),
  // El cliente puede mandar "L" o ["S","M"]
  size: z.union([z.string(), z.array(z.string())]).transform((s) => (Array.isArray(s) ? s : [s])),
  price: z.coerce.number().min(0),
  dateUploaded: z.coerce.date().optional(),
  imageUrl: z.string().optional(),
});

const filterSchema = z.object({
  size: z.string().optional(),
  availability: z.string().optional(),
  name: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  dateUploaded: z.string().optional(),
});

export async function list(_req: Request, res: Response) {
  res.json(await productService.listProducts());
}

export async function filter(req: Request, res: Response) {
  res.json(await productService.listProducts(filterSchema.parse(req.query)));
}

export async function maxPrice(_req: Request, res: Response) {
  res.json({ maxPrice: await productService.getMaxPrice() });
}

export async function get(req: Request, res: Response) {
  res.json(await productService.getProduct(req.params.id as string));
}

export async function create(req: Request, res: Response) {
  res.status(201).json(await productService.createProduct(productSchema.parse(req.body)));
}

export async function update(req: Request, res: Response) {
  const data = productSchema.partial().parse(req.body);
  res.json(await productService.updateProduct(req.params.id as string, data));
}

export async function remove(req: Request, res: Response) {
  const doc = await productService.deleteProduct(req.params.id as string);
  res.json({ mensaje: 'Producto eliminado', doc });
}
