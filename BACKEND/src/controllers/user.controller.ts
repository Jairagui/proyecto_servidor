import type { Request, Response } from 'express';
import { z } from 'zod';
import * as authService from '../services/auth.service';

const registerSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  email: z.string().trim().email('El correo no tiene un formato válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function register(req: Request, res: Response) {
  const result = await authService.register(registerSchema.parse(req.body));
  res.status(201).json({ message: 'Usuario registrado correctamente', ...result });
}

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);
  const result = await authService.login(email, password);
  res.json({ message: 'Inicio de sesión exitoso', ...result });
}

export async function me(req: Request, res: Response) {
  res.json(await authService.getUserById(req.user!.id));
}
