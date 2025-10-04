import React from 'react';

export default function SettingsDemoPage() {
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
            <a href="/insights-demo" className="text-black transition hover:text-gray-600">
              Insights
            </a>
            <a href="/actions-demo" className="text-black transition hover:text-gray-600">
              Actions
            </a>
            <a href="/settings-demo" className="text-[#1B4332] font-semibold transition hover:text-gray-600">
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
          <h1 className="text-4xl font-bold text-[#1B4332] mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-[#1B4332] mb-6 flex items-center gap-2">
              <span>👤</span>
              Profile Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value="Demo User"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value="demo@greenprint.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  readOnly
                />
              </div>
              <button className="w-full bg-[#1B4332] text-white px-6 py-2 rounded-lg hover:opacity-90 transition">
                Update Profile
              </button>
            </div>
          </div>

          {/* Carbon Budget */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-[#1B4332] mb-6 flex items-center gap-2">
              <span>🎯</span>
              Carbon Budget
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly CO2e Limit (kg)
                </label>
                <input
                  type="number"
                  value="300"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Current Month Progress</p>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '14.2%' }} />
                </div>
                <p className="text-xs text-gray-500">42.5 kg of 300 kg used (14.2%)</p>
              </div>
              <button className="w-full bg-[#1B4332] text-white px-6 py-2 rounded-lg hover:opacity-90 transition">
                Save Budget
              </button>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-[#1B4332] mb-6 flex items-center gap-2">
              <span>💳</span>
              Connected Accounts
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Capital One Checking</p>
                  <p className="text-sm text-gray-500">••••6789</p>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Connected
                </div>
              </div>
              <button className="w-full bg-[#1B4332] text-white px-6 py-2 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2">
                <span>🔄</span>
                Sync Accounts
              </button>
              <button className="w-full border-2 border-[#1B4332] text-[#1B4332] px-6 py-2 rounded-lg hover:bg-[#1B4332] hover:text-white transition">
                Add Account
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-[#1B4332] mb-6 flex items-center gap-2">
              <span>🔔</span>
              Notifications
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Budget alerts', description: 'Get notified when approaching your carbon budget', checked: true },
                { label: 'Weekly summaries', description: 'Receive weekly carbon footprint reports', checked: true },
                { label: 'New recommendations', description: 'Alerts for new sustainability actions', checked: false },
                { label: 'Transaction sync', description: 'Notifications when new transactions are processed', checked: false },
              ].map((setting, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={setting.checked}
                    className="mt-1 h-4 w-4 text-[#1B4332] border-gray-300 rounded focus:ring-[#1B4332]"
                    readOnly
                  />
                  <div>
                    <p className="font-medium text-gray-900">{setting.label}</p>
                    <p className="text-xs text-gray-500">{setting.description}</p>
                  </div>
                </div>
              ))}
              <button className="w-full bg-[#1B4332] text-white px-6 py-2 rounded-lg hover:opacity-90 transition">
                Save Preferences
              </button>
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-[#1B4332] mb-6 flex items-center gap-2">
              <span>🔒</span>
              Data & Privacy
            </h2>
            <div className="space-y-3">
              <button className="w-full bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2">
                <span>📥</span>
                Export My Data
              </button>
              <button className="w-full bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2">
                <span>🗑️</span>
                Delete Account
              </button>
              <div className="pt-4 border-t border-gray-200">
                <a href="/privacy" className="text-sm text-[#1B4332] hover:underline block mb-2">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-sm text-[#1B4332] hover:underline block">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-[#1B4332] mb-6 flex items-center gap-2">
              <span>ℹ️</span>
              About Greenprint
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Version</p>
                <p className="font-semibold text-gray-900">1.0.0</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                <p className="font-semibold text-gray-900">October 2025</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-700 mb-4">
                  Greenprint helps you track and reduce your carbon footprint by analyzing your spending patterns and providing personalized sustainability recommendations.
                </p>
                <button className="w-full border-2 border-[#1B4332] text-[#1B4332] px-6 py-2 rounded-lg hover:bg-[#1B4332] hover:text-white transition">
                  Learn More
                </button>
              </div>
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

