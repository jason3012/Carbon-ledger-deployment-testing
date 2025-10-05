'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { useAuthStore } from '@/store/auth';
import { CreditCard, Leaf, Download } from 'lucide-react';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const [budgetLimit, setBudgetLimit] = useState('300');

  const { data: accounts, refetch: refetchAccounts } = trpc.accounts.list.useQuery();
  const syncAccountsMutation = trpc.accounts.syncFromNessie.useMutation();
  const setBudgetMutation = trpc.budgets.upsert.useMutation();
  const demoLoginMutation = trpc.auth.demoLogin.useMutation();

  const handleSyncAccounts = async () => {
    try {
      await syncAccountsMutation.mutateAsync({ useRealNessie: false });
      await refetchAccounts();
    } catch (error) {
      console.error('Sync failed:', error);
      
      // If it's a foreign key constraint error, refresh the token
      if (error.message?.includes('Foreign key constraint violated')) {
        console.log('🔄 Token mismatch detected, refreshing...');
        // Clear old token and reload
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  const handleSetBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    await setBudgetMutation.mutateAsync({
      month,
      limitKg: parseFloat(budgetLimit),
    });
  };

  const handleRefreshToken = async () => {
    try {
      const result = await demoLoginMutation.mutateAsync();
      // Update the auth store with the new token
      localStorage.setItem('token', result.token);
      window.location.reload();
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-muted-foreground">{user?.name || 'Not set'}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <div className="pt-4 border-t">
            <Button 
              onClick={handleRefreshToken}
              disabled={demoLoginMutation.isPending}
              variant="outline"
              size="sm"
            >
              {demoLoginMutation.isPending ? 'Refreshing...' : '🔄 Refresh Token'}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Use this if you get authentication errors after database resets
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Manage your linked bank accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {accounts && accounts.length > 0 ? (
            <div className="space-y-2">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{account.bankName}</p>
                      <p className="text-sm text-muted-foreground">{account.accountType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {account._count?.transactions || 0} transactions
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">No accounts connected</p>
              <div className="rounded-lg bg-muted p-4 text-sm">
                <p className="font-semibold mb-2">🏦 Sync from Nessie API</p>
                <p className="text-muted-foreground mb-3">
                  Click below to fetch your accounts and transactions from Capital One's Nessie API.
                </p>
                <Button
                  onClick={handleSyncAccounts}
                  disabled={syncAccountsMutation.isPending}
                  variant="default"
                  size="sm"
                >
                  {syncAccountsMutation.isPending ? 'Syncing from Nessie...' : 'Sync Accounts from Nessie'}
                </Button>
                {syncAccountsMutation.isError && (
                  <p className="text-sm text-red-500 mt-2">
                    Error: {syncAccountsMutation.error.message}
                  </p>
                )}
                {syncAccountsMutation.isSuccess && (
                  <p className="text-sm text-green-600 mt-2">
                    ✅ Successfully synced accounts! Check the Dashboard.
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Carbon Budget */}
      <Card>
        <CardHeader>
          <CardTitle>Carbon Budget</CardTitle>
          <CardDescription>Set your monthly emissions goal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetBudget} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Monthly Limit (kg CO2e)
              </label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  placeholder="300"
                  min="0"
                  step="10"
                />
                <Button type="submit" disabled={setBudgetMutation.isPending}>
                  <Leaf className="mr-2 h-4 w-4" />
                  Set Budget
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Average US household: ~1,500 kg CO2e/month
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export or delete your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data (CSV)
          </Button>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              Delete all your data permanently
            </p>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

