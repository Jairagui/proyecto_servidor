// Crea un usuario administrador y algunos productos de ejemplo.
// Uso: npm run seed
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from './config/db';
import { User } from './models/user.model';
import { Product } from './models/product.model';

async function seed() {
  await connectDB();

  // Admin (si ya existe no se vuelve a crear)
  const adminEmail = 'admin@tienda.com';
  if (!(await User.exists({ email: adminEmail }))) {
    const password = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Administrador', email: adminEmail, password, role: 'admin' });
    console.log('Admin creado: admin@tienda.com / admin123');
  }

  // Productos de ejemplo (solo si la colección está vacía)
  if ((await Product.countDocuments()) === 0) {
    await Product.insertMany([
      { name: 'Playera básica blanca', description: 'Algodón 100%', price: 249, stock: 30, size: ['S', 'M', 'L'] },
      { name: 'Playera oversize negra', description: 'Corte holgado', price: 349, stock: 18, size: ['M', 'L', 'XL'] },
      { name: 'Hoodie azul marino', description: 'Con capucha', price: 899, stock: 12, size: ['M', 'L'] },
      { name: 'Jeans slim fit', description: 'Mezclilla azul', price: 999, stock: 15, size: ['S', 'M', 'L'] },
      { name: 'Chamarra de mezclilla', description: 'Clásica', price: 1299, stock: 0, size: ['M', 'L'] },
      { name: 'Gorra bordada', description: 'Ajustable', price: 250, stock: 25, size: ['U'] },
    ]);
    console.log('Productos de ejemplo creados');
  }

  await mongoose.disconnect();
}

seed();
