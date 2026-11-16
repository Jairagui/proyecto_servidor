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

// Filtros del catálogo: todos son opcionales
const filterSchema = z.object({
  search: z.string().optional(),
  size: z.string().optional(),
  minPrice: z.coerce.number().min(0, 'minPrice no puede ser negativo').optional(),
  maxPrice: z.coerce.number().min(0, 'maxPrice no puede ser negativo').optional(),
  inStock: z.enum(['true', 'false']).optional(),
  sort: z.enum(['price_asc', 'price_desc']).optional(),
});

export async function list(req: Request, res: Response) {
  const filters = filterSchema.parse(req.query);
  res.json(await productService.listProducts(filters));
}

export async function get(req: Request, res: Response) {
  res.json(await productService.getProduct(req.params.id as string));
}

export async function create(req: Request, res: Response) {
  res.status(201).json(await productService.createProduct(productSchema.parse(req.body)));
}

export async function update(req: Request, res: Response) {
  // En la actualización todos los campos son opcionales
  const data = productSchema.partial().parse(req.body);
  res.json(await productService.updateProduct(req.params.id as string, data));
}

export async function remove(req: Request, res: Response) {
  await productService.deleteProduct(req.params.id as string);
  res.json({ message: 'Producto eliminado' });
}
