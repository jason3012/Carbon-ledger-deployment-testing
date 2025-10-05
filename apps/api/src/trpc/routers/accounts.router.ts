import { z } from 'zod';
import { router, protectedProcedure } from '../index';
import { AccountsService } from '../../modules/accounts/accounts.service';

const accountsService = new AccountsService();

export const accountsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return accountsService.getAccounts(ctx.userId);
  }),

  get: protectedProcedure
    .input(z.object({ accountId: z.string() }))
    .query(async ({ input }) => {
      return accountsService.getAccount(input.accountId);
    }),

  syncFromNessie: protectedProcedure
    .input(z.object({ useRealNessie: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
      return accountsService.syncNessieAccounts(ctx.userId, input.useRealNessie ?? false);
    }),
});

