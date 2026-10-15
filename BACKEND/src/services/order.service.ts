import { Types } from 'mongoose';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { HttpError } from '../utils/httpError';

export interface CartInput {
  _id: string;
  quantity: number;
  size?: string | string[];
}

export interface PricedLine {
  _id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

/**
 * Regla de negocio central: el precio SIEMPRE sale de la base de datos, nunca del cliente,
 * y se valida existencia, disponibilidad y stock (sumando cantidades repetidas del mismo producto).
 */
export async function priceCart(cart: CartInput[]): Promise<{ lines: PricedLine[]; total: number }> {
  const ids = [...new Set(cart.map((i) => i._id))];
  if (ids.some((id) => !Types.ObjectId.isValid(id))) throw HttpError.badRequest('Id de producto inválido');

  const products = await Product.find({ _id: { $in: ids } });
  const byId = new Map(products.map((p) => [String(p._id), p]));

  const requested = new Map<string, number>();
  for (const item of cart) requested.set(item._id, (requested.get(item._id) ?? 0) + item.quantity);

  for (const [id, qty] of requested) {
    const p = byId.get(id);
    if (!p) throw HttpError.notFound(`Producto no encontrado: ${id}`);
    if (!p.availability || p.stock === 0) throw HttpError.badRequest(`El producto "${p.name}" está agotado.`);
    if (qty > p.stock) throw HttpError.badRequest(`Cantidad solicitada para "${p.name}" excede el stock disponible.`);
  }

  const lines: PricedLine[] = cart.map((item) => {
    const p = byId.get(item._id)!;
    const size = Array.isArray(item.size) ? item.size[0] : item.size;
    return {
      _id: item._id,
      name: p.name,
      size: size ?? p.size[0] ?? '',
      price: p.price,
      quantity: item.quantity,
      imageUrl: p.imageUrl ?? '',
    };
  });

  const total = Math.round(lines.reduce((sum, l) => sum + l.price * l.quantity, 0) * 100) / 100;
  return { lines, total };
}

export async function createOrder(userId: string, cart: CartInput[]) {
  const { lines, total } = await priceCart(cart);

  // Reserva de stock atómica: el $gte en el filtro evita vender de más con requests concurrentes.
  const quantities = new Map<string, number>();
  for (const l of lines) quantities.set(l._id, (quantities.get(l._id) ?? 0) + l.quantity);

  const reserved: [string, number][] = [];
  const rollback = () =>
    Promise.all(reserved.map(([id, q]) => Product.updateOne({ _id: id }, { $inc: { stock: q, timesSold: -q } })));

  try {
    for (const [id, qty] of quantities) {
      const res = await Product.updateOne({ _id: id, stock: { $gte: qty } }, { $inc: { stock: -qty, timesSold: qty } });
      if (res.modifiedCount === 0) throw HttpError.conflict('El stock cambió mientras se procesaba el pedido');
      reserved.push([id, qty]);
    }
    return await Order.create({ userId, items: lines, total });
  } catch (err) {
    await rollback(); // compensación si algo falla a la mitad
    throw err;
  }
}

export const getUserOrders = (userId: string) => Order.find({ userId }).sort({ createdAt: -1 });
