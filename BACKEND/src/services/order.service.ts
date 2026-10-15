import { Types } from 'mongoose';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { HttpError } from '../utils/httpError';

export interface CartItem {
  _id: string;
  quantity: number;
}

/**
 * Regla de negocio central: el precio SIEMPRE sale de la base de datos, nunca del cliente.
 * También se valida que el producto exista y que haya stock suficiente.
 */
export async function createOrder(userId: string, cart: CartItem[]) {
  const lines = [];

  for (const item of cart) {
    if (!Types.ObjectId.isValid(item._id)) throw HttpError.badRequest('Id de producto inválido');
    const product = await Product.findById(item._id);
    if (!product) throw HttpError.notFound(`Producto no encontrado: ${item._id}`);
    if (item.quantity > product.stock) {
      throw HttpError.badRequest(`Stock insuficiente para "${product.name}" (disponible: ${product.stock})`);
    }
    lines.push({ _id: String(product._id), name: product.name, price: product.price, quantity: item.quantity });
  }

  const total = Math.round(lines.reduce((sum, l) => sum + l.price * l.quantity, 0) * 100) / 100;

  for (const l of lines) await Product.updateOne({ _id: l._id }, { $inc: { stock: -l.quantity } });

  return Order.create({ userId, items: lines, total });
}

export const getUserOrders = (userId: string) => Order.find({ userId }).sort({ createdAt: -1 });
