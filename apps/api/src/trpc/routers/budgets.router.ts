import { z } from 'zod';
import { router, protectedProcedure } from '../index';
import { BudgetsService } from '../../modules/budgets/budgets.service';

const budgetsService = new BudgetsService();

export const budgetsRouter: any = router({
  get: protectedProcedure
    .input(z.object({ month: z.string() }))
    .query(async ({ ctx, input }) => {
      return budgetsService.getBudget(ctx.userId, input.month);
    }),

  upsert: protectedProcedure
    .input(
      z.object({
        month: z.string(),
        limitKg: z.number().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return budgetsService.upsertBudget(ctx.userId, input.month, input.limitKg);
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return budgetsService.getAllBudgets(ctx.userId);
  }),
});

