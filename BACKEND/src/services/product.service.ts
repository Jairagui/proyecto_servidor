import type { FilterQuery } from 'mongoose';
import { Product } from '../models/product.model';
import { HttpError } from '../utils/httpError';

export interface ProductFilterInput {
  size?: string;
  availability?: string;
  name?: string;
  minPrice?: string;
  maxPrice?: string;
  dateUploaded?: string;
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Función pura (testeable sin base de datos): traduce los query params a un filtro de Mongo. */
export function buildProductFilter(q: ProductFilterInput): FilterQuery<unknown> {
  const filter: Record<string, unknown> = {};

  if (q.size) filter.size = q.size.includes(',') ? { $in: q.size.split(',') } : q.size;
  if (q.availability !== undefined) filter.availability = q.availability === 'true';
  if (q.name) filter.name = { $regex: escapeRegex(q.name), $options: 'i' };

  if (q.minPrice || q.maxPrice) {
    const price: Record<string, number> = {};
    if (q.minPrice) price.$gte = parseFloat(q.minPrice);
    if (q.maxPrice) price.$lte = parseFloat(q.maxPrice);
    filter.price = price;
  }

  if (q.dateUploaded) {
    const start = new Date(q.dateUploaded);
    if (!Number.isNaN(start.getTime())) {
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);
      filter.dateUploaded = { $gte: start, $lt: end };
    }
  }
  return filter;
}

export const listProducts = (query: ProductFilterInput = {}) => Product.find(buildProductFilter(query));

export async function getMaxPrice(): Promise<number> {
  const top = await Product.findOne().sort({ price: -1 }).select('price');
  return top?.price ?? 0;
}

export async function getProduct(id: string) {
  const product = await Product.findById(id);
  if (!product) throw HttpError.notFound('Producto no encontrado');
  return product;
}

export const createProduct = (data: Record<string, unknown>) => Product.create(data);

export async function updateProduct(id: string, data: Record<string, unknown>) {
  const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!product) throw HttpError.notFound('Producto no encontrado');
  return product;
}

export async function deleteProduct(id: string) {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw HttpError.notFound('Producto no encontrado');
  return product;
}
