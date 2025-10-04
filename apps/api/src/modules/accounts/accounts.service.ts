import { prisma } from '@carbon-ledger/db';
import { getNessieClient } from '../transactions/nessie-mock';

export class AccountsService {
  async createAccount(userId: string, externalId: string, bankName: string, accountType: string) {
    return prisma.account.create({
      data: {
        userId,
        externalId,
        bankName,
        accountType,
      },
    });
  }

  async getAccounts(userId: string) {
    return prisma.account.findMany({
      where: { userId },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });
  }

  async getAccount(accountId: string) {
    return prisma.account.findUnique({
      where: { id: accountId },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });
  }

  async syncNessieAccounts(userId: string, useRealNessie = false) {
    const nessieClient = getNessieClient(useRealNessie);
    const nessieAccounts = await nessieClient.getAccounts('mock_customer');

    const synced = [];

    for (const nessieAccount of nessieAccounts) {
      const existing = await prisma.account.findFirst({
        where: {
          userId,
          externalId: nessieAccount._id,
        },
      });

      if (!existing) {
        const account = await this.createAccount(
          userId,
          nessieAccount._id,
          'Capital One',
          nessieAccount.type
        );
        synced.push(account);
      }
    }

    return synced;
  }
}

