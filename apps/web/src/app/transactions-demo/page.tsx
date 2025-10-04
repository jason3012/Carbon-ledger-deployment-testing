import React from 'react';

export default function TransactionsDemoPage() {
  const transactions = [
    { id: 1, date: '2025-10-03', merchant: 'Uber', amount: '$15.50', category: 'Transportation', emissions: '3.2 kg CO2e' },
    { id: 2, date: '2025-10-02', merchant: 'Whole Foods', amount: '$67.89', category: 'Food & Dining', emissions: '5.1 kg CO2e' },
    { id: 3, date: '2025-10-01', merchant: 'Shell Gas Station', amount: '$45.00', category: 'Transportation', emissions: '12.5 kg CO2e' },
    { id: 4, date: '2025-09-30', merchant: 'Amazon', amount: '$89.99', category: 'Shopping', emissions: '2.8 kg CO2e' },
    { id: 5, date: '2025-09-29', merchant: 'ConEd Utilities', amount: '$120.00', category: 'Utilities', emissions: '18.3 kg CO2e' },
    { id: 6, date: '2025-09-28', merchant: 'Starbucks', amount: '$5.75', category: 'Food & Dining', emissions: '0.9 kg CO2e' },
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
            <a href="/transactions-demo" className="text-[#1B4332] font-semibold transition hover:text-gray-600">
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#1B4332] mb-2">Transactions</h1>
            <p className="text-gray-600">View and analyze your carbon footprint</p>
          </div>
          <button className="bg-[#1B4332] text-white px-6 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2">
            <span>🔄</span>
            Sync
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]">
              <option>All Categories</option>
              <option>Transportation</option>
              <option>Food & Dining</option>
              <option>Shopping</option>
              <option>Utilities</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]">
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>Last Year</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Merchant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carbon Footprint
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx, index) => (
                <tr key={tx.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {tx.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{tx.merchant}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-[#1B4332]/10 text-[#1B4332]">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {tx.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-[#1B4332]">{tx.emissions}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Card */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-[#1B4332]">{transactions.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-[#1B4332]">$344.13</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Emissions</p>
              <p className="text-2xl font-bold text-[#1B4332]">42.8 kg CO2e</p>
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

