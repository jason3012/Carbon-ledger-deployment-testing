import React from 'react';

export default function InsightsDemoPage() {
  const categories = [
    { name: 'Transportation', emissions: '15.2 kg', transactions: 8, percentage: 36, trend: 'down' },
    { name: 'Food & Dining', emissions: '12.8 kg', transactions: 15, percentage: 30, trend: 'up' },
    { name: 'Utilities', emissions: '8.5 kg', transactions: 3, percentage: 20, trend: 'down' },
    { name: 'Shopping', emissions: '4.2 kg', transactions: 6, percentage: 10, trend: 'stable' },
    { name: 'Other', emissions: '1.8 kg', transactions: 4, percentage: 4, trend: 'up' },
  ];

  return (
    <main className="min-h-screen max-w-full overflow-x-hidden bg-[#E5FCD4] text-black">
      {/* Top Border Accent */}
      <div className="h-1 w-full bg-[#1B4332]" />

      {/* Navbar */}
      <header className="bg-white shadow-sm w-full">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 w-full">
          <a href="/" className="text-2xl font-bold tracking-tight text-black hover:text-gray-700 transition">
            Greenprint
          </a>
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="/dashboard-demo" className="text-black transition hover:text-gray-600">
              Dashboard
            </a>
            <a href="/transactions-demo" className="text-black transition hover:text-gray-600">
              Transactions
            </a>
            <a href="/insights-demo" className="text-[#1B4332] font-semibold transition hover:text-gray-600">
              Insights
            </a>
            <a href="/actions-demo" className="text-black transition hover:text-gray-600">
              Actions
            </a>
            <a href="/settings-demo" className="text-black transition hover:text-gray-600">
              Settings
            </a>
            <a href="/" className="text-black transition hover:text-gray-600">
              Home
            </a>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1B4332] mb-2">Insights</h1>
          <p className="text-gray-600">Deep dive into your carbon footprint</p>
        </div>

        {/* Category Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-[#1B4332] mb-6">Category Analysis</h2>
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">
                      {category.transactions} transaction{category.transactions !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="text-lg font-bold text-[#1B4332]">{category.emissions}</p>
                      <p className="text-sm text-gray-500">{category.percentage}% of total</p>
                    </div>
                    <div className="text-2xl">
                      {category.trend === 'down' && '📉'}
                      {category.trend === 'up' && '📈'}
                      {category.trend === 'stable' && '➡️'}
                    </div>
                  </div>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-[#1B4332] rounded-full transition-all"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          {/* Top Emission Sources */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-[#1B4332] mb-4">Top Emission Sources</h2>
            <div className="space-y-4">
              {[
                { name: 'Gas Station Visits', amount: '12.5 kg CO2e', icon: '⛽' },
                { name: 'Electric Bill', amount: '8.3 kg CO2e', icon: '⚡' },
                { name: 'Grocery Shopping', amount: '5.1 kg CO2e', icon: '🛒' },
                { name: 'Ride Sharing', amount: '3.2 kg CO2e', icon: '🚗' },
              ].map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{source.icon}</div>
                    <span className="font-medium text-gray-900">{source.name}</span>
                  </div>
                  <span className="font-semibold text-[#1B4332]">{source.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-[#1B4332] mb-4">How You Compare</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Your Average</span>
                  <span className="text-sm font-semibold text-[#1B4332]">42.5 kg/month</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">US Average</span>
                  <span className="text-sm font-semibold text-gray-700">68.0 kg/month</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 relative mt-4">
                  <div className="absolute h-2 w-[62.5%] bg-green-500 rounded-full" />
                  <div className="absolute left-[62.5%] top-0 h-4 w-0.5 bg-[#1B4332]" />
                </div>
                <p className="text-sm text-green-600 font-medium mt-2">
                  ✨ You're 37% below average!
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Carbon Offset Equivalents</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🌳</span>
                    <span className="text-sm text-gray-700">2.1 trees planted per month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🚗</span>
                    <span className="text-sm text-gray-700">105 miles not driven</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-[#1B4332] mb-4">Monthly Comparison</h2>
          <div className="grid grid-cols-6 gap-4">
            {[
              { month: 'Jan', current: 65, previous: 70 },
              { month: 'Feb', current: 58, previous: 65 },
              { month: 'Mar', current: 72, previous: 75 },
              { month: 'Apr', current: 61, previous: 72 },
              { month: 'May', current: 51, previous: 61 },
              { month: 'Jun', current: 42, previous: 51 },
            ].map((data) => (
              <div key={data.month} className="text-center">
                <p className="text-xs text-gray-600 mb-2">{data.month}</p>
                <div className="h-32 flex items-end justify-center gap-1">
                  <div
                    className="w-6 bg-gray-300 rounded-t"
                    style={{ height: `${(data.previous / 75) * 100}%` }}
                    title={`Previous: ${data.previous}kg`}
                  />
                  <div
                    className="w-6 bg-[#1B4332] rounded-t"
                    style={{ height: `${(data.current / 75) * 100}%` }}
                    title={`Current: ${data.current}kg`}
                  />
                </div>
                <p className="text-xs font-semibold text-[#1B4332] mt-2">{data.current}kg</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded" />
              <span className="text-xs text-gray-600">Previous Period</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#1B4332] rounded" />
              <span className="text-xs text-gray-600">Current Period</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1B4332] py-8 text-white w-full mt-12">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm w-full">
          <p>&copy; 2025 Greenprint. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="/privacy" className="hover:text-gray-300">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-gray-300">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

