import { prisma } from '@carbon-ledger/db';
import { getAllLocalFactors } from '@carbon-ledger/emissions';
import bcrypt from 'bcrypt';
import { logger } from '../../utils/logger';

async function main() {
  logger.info('Starting database seed...');

  // Clear existing data
  await prisma.emissionEstimate.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.merchant.deleteMany();
  await prisma.account.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.emissionFactor.deleteMany();
  await prisma.user.deleteMany();

  logger.info('Cleared existing data');

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@carbonledger.com',
      name: 'Demo User',
      password: demoPassword,
    },
  });

  logger.info(`Created demo user: ${demoUser.email}`);

  // Seed emission factors
  const localFactors = getAllLocalFactors();
  for (const factor of localFactors) {
    await prisma.emissionFactor.create({
      data: {
        source: factor.source,
        scope: factor.scope,
        unitType: factor.unitType,
        unit: factor.unit,
        kgCO2ePerUnit: factor.kgCO2ePerUnit,
        categoryKey: factor.categoryKey,
        notes: factor.notes,
      },
    });
  }

  logger.info(`Seeded ${localFactors.length} emission factors`);

  // NO MOCK DATA - Will sync from Nessie API
  logger.info('No mock accounts or transactions seeded.');
  logger.info('Login and use Settings to sync from Nessie API.');

  // Set carbon budget
  const currentMonth = new Date().toISOString().slice(0, 7);
  await prisma.budget.create({
    data: {
      userId: demoUser.id,
      month: currentMonth,
      limitKg: 300,
    },
  });

  logger.info('Seeded complete!');
  logger.info('---------------------------');
  logger.info('Demo credentials:');
  logger.info('Email: demo@carbonledger.com');
  logger.info('Password: demo123');
  logger.info('---------------------------');
}

main()
  .catch((e) => {
    logger.error('Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

