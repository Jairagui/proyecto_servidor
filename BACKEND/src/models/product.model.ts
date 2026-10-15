import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  availability: { type: Boolean, default: true },
  size: { type: [String], required: true },
  dateUploaded: { type: Date, default: Date.now },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Product = model('products', productSchema);
