import { prisma, EmissionMethod } from '@carbon-ledger/db';
import { estimateEmissions } from '@carbon-ledger/emissions';
import { logger } from '../../utils/logger';

export class EmissionsService {
  /**
   * Compute emissions for a single transaction
   */
  async computeEmission(transactionId: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Calculate emission estimate
    const estimate = estimateEmissions(
      transaction.amountUSD,
      transaction.category,
      transaction.rawDescription
    );

    // Check if factor exists in database, create if needed
    let factor = null;
    if (estimate.details.source) {
      factor = await this.getOrCreateFactor(estimate.details);
    }

    // Upsert emission estimate
    const emissionEstimate = await prisma.emissionEstimate.upsert({
      where: { transactionId },
      create: {
        transactionId,
        method: estimate.method,
        kgCO2e: estimate.kgCO2e,
        factorId: factor?.id,
        details: estimate.details,
      },
      update: {
        method: estimate.method,
        kgCO2e: estimate.kgCO2e,
        factorId: factor?.id,
        details: estimate.details,
      },
    });

    return emissionEstimate;
  }

  /**
   * Batch compute emissions for transactions without estimates
   */
  async computeMissingEmissions(accountId?: string) {
    const where: any = {
      emissionEstimate: null,
    };

    if (accountId) {
      where.accountId = accountId;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      take: 1000, // Process in batches
    });

    logger.info(`Computing emissions for ${transactions.length} transactions`);

    let computed = 0;

    for (const transaction of transactions) {
      try {
        await this.computeEmission(transaction.id);
        computed++;
      } catch (error) {
        logger.error(`Failed to compute emission for ${transaction.id}`, error);
      }
    }

    logger.info(`Successfully computed ${computed} emissions`);

    return { computed, total: transactions.length };
  }

  /**
   * Recompute all emissions (useful when factors are updated)
   */
  async recomputeAllEmissions() {
    const transactions = await prisma.transaction.findMany({
      select: { id: true },
    });

    logger.info(`Recomputing emissions for ${transactions.length} transactions`);

    let recomputed = 0;

    for (const transaction of transactions) {
      try {
        await this.computeEmission(transaction.id);
        recomputed++;
      } catch (error) {
        logger.error(`Failed to recompute emission for ${transaction.id}`, error);
      }
    }

    logger.info(`Successfully recomputed ${recomputed} emissions`);

    return { recomputed, total: transactions.length };
  }

  private async getOrCreateFactor(details: any) {
    let factor = await prisma.emissionFactor.findFirst({
      where: {
        categoryKey: details.categoryKey,
        unit: details.unit,
        kgCO2ePerUnit: details.factor,
      },
    });

    if (!factor) {
      factor = await prisma.emissionFactor.create({
        data: {
          source: details.source,
          scope: 'calculated',
          unitType: details.unit === 'USD' ? 'monetary' : 'physical',
          unit: details.unit,
          kgCO2ePerUnit: details.factor,
          categoryKey: details.categoryKey,
          notes: details.notes,
        },
      });
    }

    return factor;
  }

  /**
   * Get dashboard statistics for a user
   */
  async getDashboardStats(userId: string, month?: string) {
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });

    const accountIds = accounts.map((a) => a.id);

    // Current month filter
    const now = new Date();
    const currentMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const [year, monthNum] = currentMonth.split('-');
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59);

    // Last month filter
    const lastMonthDate = new Date(startDate);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    const lastMonthStart = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth(), 1);
    const lastMonthEnd = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth() + 1, 0, 23, 59, 59);

    // Get current month emissions
    const currentMonthTxns = await prisma.transaction.findMany({
      where: {
        accountId: { in: accountIds },
        date: { gte: startDate, lte: endDate },
      },
      include: { emissionEstimate: true },
    });

    const currentMonthKg = currentMonthTxns.reduce(
      (sum, txn) => sum + (txn.emissionEstimate?.kgCO2e || 0),
      0
    );

    // Get last month emissions
    const lastMonthTxns = await prisma.transaction.findMany({
      where: {
        accountId: { in: accountIds },
        date: { gte: lastMonthStart, lte: lastMonthEnd },
      },
      include: { emissionEstimate: true },
    });

    const lastMonthKg = lastMonthTxns.reduce(
      (sum, txn) => sum + (txn.emissionEstimate?.kgCO2e || 0),
      0
    );

    const percentageChange = lastMonthKg > 0
      ? ((currentMonthKg - lastMonthKg) / lastMonthKg) * 100
      : 0;

    // Category breakdown
    const categoryMap = new Map<string, { kgCO2e: number; count: number }>();
    let totalKg = 0;

    currentMonthTxns.forEach((txn) => {
      const kg = txn.emissionEstimate?.kgCO2e || 0;
      totalKg += kg;
      
      const existing = categoryMap.get(txn.category) || { kgCO2e: 0, count: 0 };
      categoryMap.set(txn.category, {
        kgCO2e: existing.kgCO2e + kg,
        count: existing.count + 1,
      });
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      kgCO2e: data.kgCO2e,
      percentage: totalKg > 0 ? (data.kgCO2e / totalKg) * 100 : 0,
      transactionCount: data.count,
    })).sort((a, b) => b.kgCO2e - a.kgCO2e);

    // Daily trend
    const dailyMap = new Map<string, number>();
    currentMonthTxns.forEach((txn) => {
      const dateKey = txn.date.toISOString().split('T')[0];
      const existing = dailyMap.get(dateKey) || 0;
      dailyMap.set(dateKey, existing + (txn.emissionEstimate?.kgCO2e || 0));
    });

    const dailyTrend = Array.from(dailyMap.entries())
      .map(([date, kgCO2e]) => ({ date, kgCO2e }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top merchants
    const merchantMap = new Map<string, { kgCO2e: number; count: number }>();
    const txnsWithMerchant = await prisma.transaction.findMany({
      where: {
        accountId: { in: accountIds },
        date: { gte: startDate, lte: endDate },
        merchantId: { not: null },
      },
      include: { emissionEstimate: true, merchant: true },
    });

    txnsWithMerchant.forEach((txn) => {
      if (!txn.merchant) return;
      const kg = txn.emissionEstimate?.kgCO2e || 0;
      const existing = merchantMap.get(txn.merchant.name) || { kgCO2e: 0, count: 0 };
      merchantMap.set(txn.merchant.name, {
        kgCO2e: existing.kgCO2e + kg,
        count: existing.count + 1,
      });
    });

    const topMerchants = Array.from(merchantMap.entries())
      .map(([merchantName, data]) => ({
        merchantName,
        kgCO2e: data.kgCO2e,
        transactionCount: data.count,
      }))
      .sort((a, b) => b.kgCO2e - a.kgCO2e)
      .slice(0, 10);

    return {
      currentMonthKg,
      lastMonthKg,
      percentageChange,
      categoryBreakdown,
      dailyTrend,
      topMerchants,
    };
  }
}

