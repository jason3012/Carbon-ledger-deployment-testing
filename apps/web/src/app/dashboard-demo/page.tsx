import React from 'react';

export default function DashboardDemoPage() {
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
            <a href="/dashboard-demo" className="text-[#1B4332] font-semibold transition hover:text-gray-600">
              Dashboard
            </a>
            <a href="/transactions-demo" className="text-black transition hover:text-gray-600">
              Transactions
            </a>
            <a href="/insights-demo" className="text-black transition hover:text-gray-600">
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
          <h1 className="text-4xl font-bold text-[#1B4332] mb-2">Dashboard</h1>
          <p className="text-gray-600">Your carbon footprint overview</p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Current Month</h3>
              <div className="h-8 w-8 rounded-full bg-[#1B4332]/10 flex items-center justify-center">
                <span className="text-[#1B4332]">🌿</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-[#1B4332]">42.5 kg</div>
            <p className="text-xs text-gray-500 mt-2">CO2e emissions</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Last Month</h3>
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-600">📊</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">51.2 kg</div>
            <p className="text-xs text-gray-500 mt-2">CO2e emissions</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Change</h3>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600">📉</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600">-17%</div>
            <p className="text-xs text-gray-500 mt-2">vs. last month</p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-[#1B4332] mb-6">Emissions by Category</h2>
          <div className="space-y-4">
            {[
              { category: 'Transportation', amount: '15.2 kg', percentage: 36, color: '#1B4332' },
              { category: 'Food & Dining', amount: '12.8 kg', percentage: 30, color: '#2D5F4C' },
              { category: 'Utilities', amount: '8.5 kg', percentage: 20, color: '#52B788' },
              { category: 'Shopping', amount: '4.2 kg', percentage: 10, color: '#74C69D' },
              { category: 'Other', amount: '1.8 kg', percentage: 4, color: '#95D5B2' },
            ].map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <span className="text-sm font-bold text-[#1B4332]">{item.amount}</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-[#1B4332] mb-6">Monthly Trend</h2>
          <div className="h-64 flex items-end justify-between gap-4">
            {[
              { month: 'Jan', value: 65 },
              { month: 'Feb', value: 58 },
              { month: 'Mar', value: 72 },
              { month: 'Apr', value: 61 },
              { month: 'May', value: 51 },
              { month: 'Jun', value: 42 },
            ].map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-[#1B4332] rounded-t-lg"
                  style={{ height: `${(data.value / 72) * 100}%` }}
                />
                <p className="text-xs text-gray-600 mt-2">{data.month}</p>
                <p className="text-xs font-semibold text-[#1B4332]">{data.value}kg</p>
              </div>
            ))}
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

