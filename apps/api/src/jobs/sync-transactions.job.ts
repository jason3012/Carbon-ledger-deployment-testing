import { prisma } from '@carbon-ledger/db';
import { TransactionsService } from '../modules/transactions/transactions.service';
import { EmissionsService } from '../modules/emissions/emissions.service';
import { logger } from '../utils/logger';

const transactionsService = new TransactionsService();
const emissionsService = new EmissionsService();

/**
 * Job to sync transactions for all accounts
 */
export async function syncTransactionsJob() {
  logger.info('Starting transaction sync job');

  try {
    const accounts = await prisma.account.findMany();

    logger.info(`Found ${accounts.length} accounts to sync`);

    for (const account of accounts) {
      try {
        const result = await transactionsService.syncTransactions(account.id);
        logger.info(`Synced ${result.synced} new transactions for account ${account.id}`);

        // Compute emissions for new transactions
        if (result.synced > 0) {
          await emissionsService.computeMissingEmissions(account.id);
        }
      } catch (error) {
        logger.error(`Failed to sync account ${account.id}`, error);
      }
    }

    logger.info('Transaction sync job completed');
  } catch (error) {
    logger.error('Transaction sync job failed', error);
    throw error;
  }
}

