import { prisma } from '@carbon-ledger/db';
import { TransactionsService } from '../transactions/transactions.service';
import { getNessieClient } from '../transactions/nessie-mock';

export class AccountsService {
  private transactionsService = new TransactionsService();

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

  async syncNessieAccounts(userId: string, useRealNessie: boolean = false) {
    try {
      console.log('🔍 syncNessieAccounts called with userId:', userId, 'useRealNessie:', useRealNessie);
      
      // Check if user exists, if not create/update the demo user
      let user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        console.log('⚠️  User not found, upserting demo user...');
        // First, delete any existing demo user with different ID
        await prisma.user.deleteMany({
          where: { email: 'demo@carbonledger.com' }
        });
        // Then create the user with the token's userId
        user = await prisma.user.create({
          data: {
            id: userId, // Use the userId from the token
            email: 'demo@carbonledger.com',
            name: 'Demo User',
          },
        });
        console.log('✅ Demo user created:', user.email, 'with ID:', user.id);
      } else {
        console.log('✅ User found:', user.email);
      }
      
      const nessieClient = getNessieClient(useRealNessie);
      // Use the real customer ID from Nessie
      const customerId = '68e172569683f20dd519a407';
      console.log('📡 Fetching accounts from Nessie for customer:', customerId);
      const nessieAccounts = await nessieClient.getAccounts(customerId);
      console.log('📊 Nessie returned', nessieAccounts.length, 'account(s)');

      const synced = [];

      for (const nessieAccount of nessieAccounts) {
        console.log('🔄 Processing account:', nessieAccount._id, nessieAccount.type);
        
        const existing = await prisma.account.findFirst({
          where: {
            userId,
            externalId: nessieAccount._id,
          },
        });

        let accountToSync;
        
        if (!existing) {
          console.log('➕ Creating new account for user:', userId);
          const account = await this.createAccount(
            userId,
            nessieAccount._id,
            'Capital One',
            nessieAccount.type
          );
          console.log('✅ Account created:', account.id);
          synced.push(account);
          accountToSync = account;
        } else {
          console.log('ℹ️  Account already exists, will sync transactions');
          accountToSync = existing;
        }

        // Sync transactions for this account
        try {
          console.log('💳 Syncing transactions for account:', accountToSync.id);
          const txResult = await this.transactionsService.syncTransactions(
            accountToSync.id,
            useRealNessie
          );
          console.log(`✅ Synced ${txResult.synced} transactions (${txResult.total} total)`);
        } catch (txError) {
          console.error('❌ Failed to sync transactions for account:', accountToSync.id, txError);
          // Continue with other accounts even if one fails
        }
      }

      console.log('🎉 Sync complete. Created', synced.length, 'new account(s)');
      return synced;
    } catch (error) {
      console.error('❌ Error in syncNessieAccounts:', error);
      throw error;
    }
  }
}

