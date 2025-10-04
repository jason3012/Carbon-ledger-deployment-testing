'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { formatCO2, formatCurrency, formatDate, getCategoryLabel } from '@/lib/utils';
import { RefreshCw, Search } from 'lucide-react';

export default function TransactionsPage() {
  const [accountId, setAccountId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: accounts } = trpc.accounts.list.useQuery();
  const syncMutation = trpc.transactions.sync.useMutation();
  const computeMutation = trpc.emissions.computeMissing.useMutation();

  useEffect(() => {
    if (accounts && accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId]);

  const { data: transactions, refetch } = trpc.transactions.list.useQuery(
    {
      accountId: accountId || '',
      q: searchQuery || undefined,
    },
    {
      enabled: !!accountId,
    }
  );

  const handleSync = async () => {
    if (!accountId) return;
    await syncMutation.mutateAsync({ accountId });
    await computeMutation.mutateAsync({ accountId });
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">View and analyze your carbon footprint</p>
        </div>
        <Button onClick={handleSync} disabled={syncMutation.isPending || !accountId}>
          <RefreshCw className={`mr-2 h-4 w-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
          Sync Transactions
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Account</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            >
              {accounts?.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.bankName} - {account.accountType}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            {transactions?.length || 0} transactions found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Merchant</th>
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-right py-3 px-4 font-medium">Amount</th>
                  <th className="text-right py-3 px-4 font-medium">CO2e</th>
                  <th className="text-center py-3 px-4 font-medium">Method</th>
                </tr>
              </thead>
              <tbody>
                {transactions?.map((txn) => (
                  <tr key={txn.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm">{formatDate(txn.date)}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{txn.merchant?.name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {txn.rawDescription}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                        {getCategoryLabel(txn.category)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {formatCurrency(txn.amountUSD)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      {txn.emissionEstimate
                        ? formatCO2(txn.emissionEstimate.kgCO2e)
                        : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {txn.emissionEstimate && (
                        <span
                          className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${
                            txn.emissionEstimate.method === 'ACTIVITY'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {txn.emissionEstimate.method}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!transactions || transactions.length === 0) && (
              <p className="text-center text-muted-foreground py-8">
                No transactions found. Click "Sync Transactions" to import data.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

