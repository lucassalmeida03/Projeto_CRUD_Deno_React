import { z } from 'zod';

export const createProductSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, 'O nome do produto deve ter pelo menos 2 caracteres.'),
    description: z.string().trim().optional(),
    price: z
      .string()
      .trim()
      .min(1, 'O preço é obrigatório.')
      .transform(Number)
      .refine(Number.isFinite, 'Informe um preço válido.')
      .pipe(z.number().min(0, 'O preço deve ser maior ou igual a zero.')),
    stock: z
      .string()
      .trim()
      .min(1, 'O estoque é obrigatório.')
      .transform(Number)
      .refine(Number.isFinite, 'Informe um estoque válido.')
      .pipe(
        z
          .number()
          .int('O estoque deve ser um número inteiro.')
          .min(0, 'O estoque deve ser maior ou igual a zero.')
      ),
  })
  .transform((product) => ({
    ...product,
    description: product.description || undefined,
  }));
