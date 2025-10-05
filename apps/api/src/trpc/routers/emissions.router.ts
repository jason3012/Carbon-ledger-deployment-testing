import { z } from 'zod';
import { router, protectedProcedure } from '../index';
import { EmissionsService } from '../../modules/emissions/emissions.service';

const emissionsService = new EmissionsService();

export const emissionsRouter = router({
  dashboard: protectedProcedure
    .input(z.object({ month: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return emissionsService.getDashboardStats(ctx.userId, input.month);
    }),

  computeMissing: protectedProcedure
    .input(z.object({ accountId: z.string().optional() }))
    .mutation(async ({ input }) => {
      return emissionsService.computeMissingEmissions(input.accountId);
    }),

  recomputeAll: protectedProcedure.mutation(async () => {
    return emissionsService.recomputeAllEmissions();
  }),

  computeWithAI: protectedProcedure
    .input(z.object({ transactionId: z.string() }))
    .mutation(async ({ input }) => {
      return emissionsService.computeEmission(input.transactionId, true);
    }),
});

