import { router } from '../index';
import { authRouter } from './auth.router';
import { accountsRouter } from './accounts.router';
import { transactionsRouter } from './transactions.router';
import { emissionsRouter } from './emissions.router';
import { budgetsRouter } from './budgets.router';
import { recommendationsRouter } from './recommendations.router';

export const appRouter = router({
  auth: authRouter,
  accounts: accountsRouter,
  transactions: transactionsRouter,
  emissions: emissionsRouter,
  budgets: budgetsRouter,
  recommendations: recommendationsRouter,
});

export type AppRouter = typeof appRouter;

