import { prisma } from '@carbon-ledger/db';

export class BudgetsService {
  async getBudget(userId: string, month: string) {
    return prisma.budget.findUnique({
      where: {
        userId_month: { userId, month },
      },
    });
  }

  async upsertBudget(userId: string, month: string, limitKg: number) {
    return prisma.budget.upsert({
      where: {
        userId_month: { userId, month },
      },
      create: {
        userId,
        month,
        limitKg,
      },
      update: {
        limitKg,
      },
    });
  }

  async getAllBudgets(userId: string) {
    return prisma.budget.findMany({
      where: { userId },
      orderBy: { month: 'desc' },
    });
  }
}

