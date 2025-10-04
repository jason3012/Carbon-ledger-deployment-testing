'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { formatCO2, formatPercent, getCategoryColor, getCategoryLabel } from '@/lib/utils';
import { TrendingUp, TrendingDown, Leaf, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [month, setMonth] = useState<string>();

  const { data: stats, isLoading } = trpc.emissions.dashboard.useQuery({ month });

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (!stats) {
    return <div>No data available</div>;
  }

  const isIncrease = stats.percentageChange >= 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Your carbon footprint overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Month</CardTitle>
            <Leaf className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCO2(stats.currentMonthKg)}</div>
            <p className="text-xs text-muted-foreground">CO2e emissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Month</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCO2(stats.lastMonthKg)}</div>
            <p className="text-xs text-muted-foreground">Previous period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Change</CardTitle>
            {isIncrease ? (
              <TrendingUp className="h-4 w-4 text-destructive" />
            ) : (
              <TrendingDown className="h-4 w-4 text-primary" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${isIncrease ? 'text-destructive' : 'text-primary'}`}
            >
              {formatPercent(stats.percentageChange)}
            </div>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Emissions by Category</CardTitle>
            <CardDescription>Where your carbon footprint comes from</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.categoryBreakdown.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={stats.categoryBreakdown}
                      dataKey="kgCO2e"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.percentage.toFixed(0)}%`}
                    >
                      {stats.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCO2(value)}
                      labelFormatter={(label) => getCategoryLabel(label)}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {stats.categoryBreakdown.slice(0, 5).map((cat) => (
                    <div key={cat.category} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: getCategoryColor(cat.category) }}
                        />
                        <span>{getCategoryLabel(cat.category)}</span>
                      </div>
                      <span className="font-medium">{formatCO2(cat.kgCO2e)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground py-8">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Daily Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Emissions</CardTitle>
            <CardDescription>Your carbon footprint over time</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.dailyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={stats.dailyTrend}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).getDate().toString()}
                  />
                  <YAxis tickFormatter={(value) => `${value.toFixed(0)}`} />
                  <Tooltip
                    formatter={(value: number) => [formatCO2(value), 'Emissions']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Line
                    type="monotone"
                    dataKey="kgCO2e"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Merchants */}
      {stats.topMerchants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Carbon Sources</CardTitle>
            <CardDescription>Merchants with highest emissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topMerchants.map((merchant, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{merchant.merchantName}</p>
                    <p className="text-sm text-muted-foreground">
                      {merchant.transactionCount} transaction
                      {merchant.transactionCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCO2(merchant.kgCO2e)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

