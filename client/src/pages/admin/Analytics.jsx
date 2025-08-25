import { ChartBarIcon } from '@heroicons/react/24/outline';

const Analytics = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        {/* Animated Icon */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-indigo-100 rounded-xl rotate-6"></div>
          <div className="absolute inset-0 bg-purple-100 rounded-xl -rotate-6"></div>
          <div className="relative bg-white rounded-xl shadow-xl p-4 flex items-center justify-center">
            <ChartBarIcon className="w-12 h-12 text-indigo-600" />
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Analytics Dashboard
          <span className="inline-flex items-center ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            Coming Soon
          </span>
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          We're working on powerful analytics tools to help you make data-driven decisions.
        </p>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sales Analytics</h3>
            <p className="text-gray-600">Track your sales performance with detailed insights and trends.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Insights</h3>
            <p className="text-gray-600">Understand your customers better with demographic data.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Metrics</h3>
            <p className="text-gray-600">Monitor your business growth with key performance indicators.</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 max-w-sm mx-auto">
          <div className="bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2 rounded-full w-3/4"></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">75% Complete</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 