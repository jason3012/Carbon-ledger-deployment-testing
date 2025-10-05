import { z } from 'zod';
import { router, protectedProcedure } from '../index';
import { TransactionsService } from '../../modules/transactions/transactions.service';

const transactionsService = new TransactionsService();

export const transactionsRouter: any = router({
  list: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        month: z.string().optional(),
        category: z.string().optional(),
        q: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return transactionsService.getTransactions(input.accountId, {
        month: input.month,
        category: input.category,
        q: input.q,
      });
    }),

  get: protectedProcedure
    .input(z.object({ transactionId: z.string() }))
    .query(async ({ input }) => {
      return transactionsService.getTransaction(input.transactionId);
    }),

  sync: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        useRealNessie: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return transactionsService.syncTransactions(input.accountId, input.useRealNessie);
    }),

  createManual: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        merchantName: z.string(),
        amount: z.number().positive(),
        description: z.string(),
        date: z.string().or(z.date()),
        mcc: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const date = typeof input.date === 'string' ? new Date(input.date) : input.date;
      return transactionsService.createManualTransaction({
        ...input,
        date,
      });
    }),
});

