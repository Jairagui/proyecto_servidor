import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true, index: true },
  // Copia del producto al momento de la compra
  items: [{ _id: String, name: String, price: Number, quantity: Number }],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Order = model('Order', orderSchema);
