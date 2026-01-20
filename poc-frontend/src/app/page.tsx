'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import PowerBIReportEmbed from '@/components/PowerBIReportEmbed';
import CopilotChat from '@/components/CopilotChat';
import { LiquidMetalWrapper } from '@/components/LiquidMetalWrapper';
import { TiltCard } from '@/components/TiltCard';

export default function Home() {
  const { isAuthenticated, login, logout } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Check if we're in POC mode
  const isPocMode = process.env.NEXT_PUBLIC_POC_MODE === 'true';

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            HR Leadership Team AI Dashboard
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in with your organizational account to access the dashboard.
          </p>
          <button
            onClick={login}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign in with Microsoft
          </button>
          <p className="text-xs text-gray-500 mt-4">
            POC Mode: Authentication flow will be simulated
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Top navigation bar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-40">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12">
              <LiquidMetalWrapper 
                dispersion={0.03}
                edgeSharpness={50}
                liquify={50}
                speed={1}
                patternScale={4}
              />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">
              HR Leadership Team Dashboard
            </h1>
            {isPocMode && (
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                POC MODE
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, Manager</span>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content area - Power BI Report */}
      <div className={`flex-1 pt-16 transition-all duration-300 ${isChatOpen ? 'mr-96' : ''}`}>
        {/* Quick Stats Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <TiltCard maxTilt={5} scale={1.03}>
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">72.3%</p>
                  <p className="text-xs text-green-600 mt-1">↑ 2.1% from last month</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={5} scale={1.03}>
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Team Members</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">156</p>
                  <p className="text-xs text-gray-500 mt-1">Across 3 regions</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={5} scale={1.03}>
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Location</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">Austin</p>
                  <p className="text-xs text-gray-500 mt-1">82% compliance rate</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>

        <PowerBIReportEmbed />
      </div>

      {/* Chat overlay and button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 z-30"
          title="Open AI Assistant"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat panel overlay */}
      <CopilotChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Backdrop when chat is open */}
      {isChatOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 z-20"
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}