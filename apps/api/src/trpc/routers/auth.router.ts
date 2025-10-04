import { z } from 'zod';
import { router, publicProcedure } from '../index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';
import { env } from '../../config/env';

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User with this email already exists',
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          password: hashedPassword,
        },
      });

      const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '7d' });

      return {
        user: { id: user.id, email: user.email, name: user.name },
        token,
      };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user || !user.password) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }

      const valid = await bcrypt.compare(input.password, user.password);

      if (!valid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }

      const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '7d' });

      return {
        user: { id: user.id, email: user.email, name: user.name },
        token,
      };
    }),

  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      return null;
    }

    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    return user;
  }),
});

