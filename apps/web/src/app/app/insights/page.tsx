'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { formatCO2, getCategoryLabel } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function InsightsPage() {
  const { data: stats } = trpc.emissions.dashboard.useQuery({});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Insights</h1>
        <p className="text-muted-foreground">Deep dive into your carbon footprint</p>
      </div>

      {/* Category Deep Dive */}
      <Card>
        <CardHeader>
          <CardTitle>Category Analysis</CardTitle>
          <CardDescription>Detailed breakdown of emissions by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.categoryBreakdown.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{getCategoryLabel(category.category)}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.transactionCount} transaction{category.transactionCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{formatCO2(category.kgCO2e)}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.percentage.toFixed(1)}% of total
                    </p>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Month-over-Month Comparison</CardTitle>
          <CardDescription>How your emissions changed from last month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                {stats && stats.percentageChange < 0 ? (
                  <>
                    <div className="rounded-full bg-green-100 p-2">
                      <TrendingDown className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Great news!</p>
                      <p className="text-sm text-muted-foreground">
                        Your emissions decreased by {Math.abs(stats.percentageChange).toFixed(1)}%
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-full bg-red-100 p-2">
                      <TrendingUp className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Emissions increased</p>
                      <p className="text-sm text-muted-foreground">
                        {stats ? `Your emissions increased by ${stats.percentageChange.toFixed(1)}%` : 'No data'}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{stats ? formatCO2(stats.currentMonthKg) : '—'}</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Context & Benchmarks */}
      <Card>
        <CardHeader>
          <CardTitle>Put Your Footprint in Context</CardTitle>
          <CardDescription>How you compare to averages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div>
                <p className="font-medium">Average US Household</p>
                <p className="text-sm text-muted-foreground">Monthly carbon footprint</p>
              </div>
              <p className="text-lg font-bold">~1,500 kg CO2e</p>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
              <div>
                <p className="font-medium">Your Current Footprint</p>
                <p className="text-sm text-muted-foreground">Based on spending patterns</p>
              </div>
              <p className="text-lg font-bold">{stats ? formatCO2(stats.currentMonthKg) : '—'}</p>
            </div>
            {stats && stats.currentMonthKg < 1500 && (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm text-green-800">
                  ✨ You're doing great! Your footprint is below the US average.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

