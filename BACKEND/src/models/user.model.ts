import { Schema, model } from 'mongoose';

export const ROLES = ['customer', 'admin'] as const;
export type Role = (typeof ROLES)[number];

const userSchema = new Schema({
  name: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  email: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'El correo no tiene un formato válido'],
  },
  // select: false evita que el hash salga en las consultas
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ROLES, default: 'customer' },
  joinedAt: { type: Date, default: Date.now },
});

export const User = model('users', userSchema);
