import { prisma } from '@carbon-ledger/db';
import { classifyTransaction } from '@carbon-ledger/emissions';
import { getNessieClient } from './nessie-mock';
import { logger } from '../../utils/logger';
import { EmissionsService } from '../emissions/emissions.service';

export class TransactionsService {
  private emissionsService = new EmissionsService();
  /**
   * Sync transactions from Nessie API
   */
  async syncTransactions(accountId: string, useRealNessie = false) {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    const nessieClient = getNessieClient(useRealNessie);
    const purchases = await nessieClient.getPurchases(account.externalId);

    logger.info(`Syncing ${purchases.length} transactions for account ${accountId}`);

    const syncedTransactions = [];

    for (const purchase of purchases) {
      // Check if transaction already exists
      const existing = await prisma.transaction.findFirst({
        where: {
          accountId,
          externalId: purchase._id,
        },
      });

      if (existing) {
        continue;
      }

      // Classify transaction category
      const category = classifyTransaction(null, purchase.description);

      // Get or create merchant
      const merchant = await this.getOrCreateMerchant(
        purchase.merchant_id || 'unknown',
        category
      );

      // Create transaction
      const transaction = await prisma.transaction.create({
        data: {
          accountId,
          merchantId: merchant.id,
          externalId: purchase._id,
          date: new Date(purchase.purchase_date),
          amountUSD: purchase.amount,
          currency: 'USD',
          rawDescription: purchase.description,
          category,
          metadata: { nessieMedium: purchase.medium, nessieStatus: purchase.status },
        },
      });

      // Automatically compute emissions for the new transaction
      try {
        await this.emissionsService.computeEmission(transaction.id);
        logger.info(`✅ Computed emissions for transaction ${transaction.id}`);
      } catch (error) {
        logger.error(`❌ Failed to compute emissions for transaction ${transaction.id}:`, error);
        // Continue syncing even if emission computation fails
      }

      syncedTransactions.push(transaction);
    }

    // Update last synced timestamp
    await prisma.account.update({
      where: { id: accountId },
      data: { lastSyncedAt: new Date() },
    });

    logger.info(`Synced ${syncedTransactions.length} new transactions`);

    return {
      synced: syncedTransactions.length,
      total: purchases.length,
      transactions: syncedTransactions,
    };
  }

  private async getOrCreateMerchant(name: string, category: string) {
    let merchant = await prisma.merchant.findFirst({
      where: { name },
    });

    if (!merchant) {
      merchant = await prisma.merchant.create({
        data: { name, category },
      });
    }

    return merchant;
  }

  async getTransactions(accountId: string, filters?: {
    month?: string;
    category?: string;
    q?: string;
  }) {
    const where: any = { accountId };

    if (filters?.month) {
      const [year, month] = filters.month.split('-');
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      where.date = { gte: startDate, lte: endDate };
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.q) {
      where.rawDescription = { contains: filters.q, mode: 'insensitive' };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        merchant: true,
        emissionEstimate: {
          include: { factor: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    return transactions;
  }

  async getTransaction(id: string) {
    return prisma.transaction.findUnique({
      where: { id },
      include: {
        merchant: true,
        emissionEstimate: {
          include: { factor: true },
        },
      },
    });
  }

  /**
   * Manually create a transaction (for user input)
   */
  async createManualTransaction(data: {
    accountId: string;
    merchantName: string;
    amount: number;
    description: string;
    date: Date;
    mcc?: string;
  }) {
    // Classify the transaction
    const category = classifyTransaction(data.mcc || null, data.description);

    // Get or create merchant
    const merchant = await this.getOrCreateMerchant(data.merchantName, category);

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        accountId: data.accountId,
        merchantId: merchant.id,
        date: data.date,
        amountUSD: data.amount,
        currency: 'USD',
        rawDescription: data.description,
        mcc: data.mcc,
        category,
        metadata: { source: 'manual_input' },
      },
      include: {
        merchant: true,
      },
    });

    logger.info(`Manually created transaction ${transaction.id}`);

    return transaction;
  }
}

