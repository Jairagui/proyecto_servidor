import { Types } from 'mongoose';
import { Product } from '../models/product.model';
import { HttpError } from '../utils/httpError';

interface Filters {
  search?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: string;
  sort?: string;
}

export async function listProducts(filters: Filters) {
  if (filters.minPrice !== undefined && filters.maxPrice !== undefined && filters.minPrice > filters.maxPrice) {
    throw HttpError.badRequest('minPrice no puede ser mayor que maxPrice');
  }

  const query: any = {};

  // Búsqueda por nombre (sin importar mayúsculas)
  if (filters.search) query.name = { $regex: filters.search, $options: 'i' };

  // Talla: busca dentro del arreglo de tallas
  if (filters.size) query.size = filters.size;

  // Rango de precio
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
    if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
  }

  // Solo productos con existencias
  if (filters.inStock === 'true') query.stock = { $gt: 0 };

  let sort = {};
  if (filters.sort === 'price_asc') sort = { price: 1 };
  if (filters.sort === 'price_desc') sort = { price: -1 };

  return Product.find(query).sort(sort);
}

export async function getProduct(id: string) {
  if (!Types.ObjectId.isValid(id)) throw HttpError.badRequest('Id de producto inválido');
  const product = await Product.findById(id);
  if (!product) throw HttpError.notFound('Producto no encontrado');
  return product;
}

export const createProduct = (data: Record<string, unknown>) => Product.create(data);

export async function updateProduct(id: string, data: Record<string, unknown>) {
  if (!Types.ObjectId.isValid(id)) throw HttpError.badRequest('Id de producto inválido');
  const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!product) throw HttpError.notFound('Producto no encontrado');
  return product;
}

// Los pedidos guardan una copia del nombre y precio, así que borrar el producto no afecta el historial
export async function deleteProduct(id: string) {
  if (!Types.ObjectId.isValid(id)) throw HttpError.badRequest('Id de producto inválido');
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw HttpError.notFound('Producto no encontrado');
}
