import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  size: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Product = model('products', productSchema);
