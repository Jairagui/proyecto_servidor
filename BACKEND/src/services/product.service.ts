import { Types } from 'mongoose';
import { Product } from '../models/product.model';
import { HttpError } from '../utils/httpError';

export const listProducts = () => Product.find();

export async function getProduct(id: string) {
  if (!Types.ObjectId.isValid(id)) throw HttpError.badRequest('Id de producto inválido');
  const product = await Product.findById(id);
  if (!product) throw HttpError.notFound('Producto no encontrado');
  return product;
}

export const createProduct = (data: Record<string, unknown>) => Product.create(data);
