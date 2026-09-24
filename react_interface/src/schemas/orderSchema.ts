import { z } from 'zod';

export const createOrderSchema = z.object({
  productId: z.string().min(1, 'Produto inválido.'),
  quantity: z
    .number()
    .int('A quantidade deve ser um número inteiro.')
    .min(1, 'A quantidade mínima é 1.'),
});
