import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().trim().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.email('Digite um e-mail válido.').trim(),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  role: z.enum(['admin', 'seller', 'customer']),
});
