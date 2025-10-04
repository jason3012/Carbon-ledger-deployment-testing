import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createContext } from './trpc/context';
import { appRouter } from './trpc/routers';
import { env } from './config/env';
import { logger } from './utils/logger';
import cron from 'node-cron';
import { syncTransactionsJob } from './jobs/sync-transactions.job';
import { recomputeMonthlyJob } from './jobs/recompute-monthly.job';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// tRPC endpoint
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Job endpoints (for EventBridge Scheduler or manual triggers)
app.post('/jobs/sync-transactions', async (req, res) => {
  try {
    await syncTransactionsJob();
    res.json({ success: true, message: 'Transaction sync completed' });
  } catch (error: any) {
    logger.error('Job failed', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/jobs/recompute-monthly', async (req, res) => {
  try {
    await recomputeMonthlyJob();
    res.json({ success: true, message: 'Monthly recompute completed' });
  } catch (error: any) {
    logger.error('Job failed', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', err);
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

const PORT = parseInt(env.PORT, 10);

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 API server running on port ${PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);

  // Schedule cron jobs in development
  if (env.NODE_ENV === 'development') {
    // Sync transactions every hour
    cron.schedule('0 * * * *', () => {
      logger.info('Running scheduled transaction sync');
      syncTransactionsJob().catch((err) => logger.error('Scheduled sync failed', err));
    });

    // Recompute monthly recommendations daily at midnight
    cron.schedule('0 0 * * *', () => {
      logger.info('Running scheduled monthly recompute');
      recomputeMonthlyJob().catch((err) => logger.error('Scheduled recompute failed', err));
    });
  }
});

