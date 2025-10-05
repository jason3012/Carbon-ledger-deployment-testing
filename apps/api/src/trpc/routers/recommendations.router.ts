import { z } from 'zod';
import { router, protectedProcedure } from '../index';
import { RecommendationsService } from '../../modules/recommendations/recommendations.service';

const recommendationsService = new RecommendationsService();

export const recommendationsRouter = router({
  list: protectedProcedure
    .input(z.object({ month: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return recommendationsService.getRecommendations(ctx.userId, input.month);
    }),

  generate: protectedProcedure
    .input(z.object({ month: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return recommendationsService.generateRecommendations(ctx.userId, input.month);
    }),

  accept: protectedProcedure
    .input(z.object({ recommendationId: z.string() }))
    .mutation(async ({ input }) => {
      return recommendationsService.acceptRecommendation(input.recommendationId);
    }),

  generateAIActionPlan: protectedProcedure
    .input(z.object({ month: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return recommendationsService.generateAIActionPlan(ctx.userId, input.month);
    }),
});

