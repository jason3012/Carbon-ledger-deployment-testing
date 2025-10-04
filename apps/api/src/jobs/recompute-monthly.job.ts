import { prisma } from '@carbon-ledger/db';
import { RecommendationsService } from '../modules/recommendations/recommendations.service';
import { logger } from '../utils/logger';

const recommendationsService = new RecommendationsService();

/**
 * Job to generate monthly recommendations for all users
 */
export async function recomputeMonthlyJob() {
  logger.info('Starting monthly recompute job');

  try {
    const users = await prisma.user.findMany();

    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    logger.info(`Generating recommendations for ${users.length} users for month ${month}`);

    for (const user of users) {
      try {
        const recommendations = await recommendationsService.generateRecommendations(user.id, month);
        logger.info(`Generated ${recommendations.length} recommendations for user ${user.id}`);
      } catch (error) {
        logger.error(`Failed to generate recommendations for user ${user.id}`, error);
      }
    }

    logger.info('Monthly recompute job completed');
  } catch (error) {
    logger.error('Monthly recompute job failed', error);
    throw error;
  }
}

