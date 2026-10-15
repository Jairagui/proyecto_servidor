import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/user.model';
import { HttpError } from '../utils/httpError';

type UserLike = { _id: unknown; name: string; email: string; role?: string | null };

const toPublicUser = (u: UserLike) => ({
  id: String(u._id),
  name: u.name,
  email: u.email,
  role: u.role ?? 'customer',
});

const signToken = (u: UserLike) =>
  jwt.sign({ id: String(u._id), role: u.role ?? 'customer' }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });

export async function register(data: { name: string; email: string; password: string }) {
  const email = data.email.toLowerCase();
  if (await User.exists({ email })) throw HttpError.badRequest('Correo ya registrado');

  const password = await bcrypt.hash(data.password, 10);
  // El rol nunca viene del request: todo registro público es "customer".
  const user = await User.create({ name: data.name, email, password, role: 'customer' });
  return { user: toPublicUser(user), token: signToken(user) };
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  // Mismo mensaje si el correo no existe o la contraseña falla.
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw HttpError.badRequest('Credenciales incorrectas');
  }
  return { user: toPublicUser(user), token: signToken(user) };
}

export async function getUserById(id: string) {
  const user = await User.findById(id);
  if (!user) throw HttpError.notFound('Usuario no encontrado');
  return toPublicUser(user);
}
