"use client";

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex flex-row-reverse min-h-screen bg-neutral-50">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 right-0 w-64 bg-white border-l border-neutral-200 transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <AdminSidebar />
        </aside>

        {/* Main */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-200">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden inline-flex items-center justify-center gap-2 bg-transparent text-neutral-600 font-medium text-base px-4 py-2.5 rounded-lg hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="منویadmin"
            >
              <span className="block h-0.5 w-5 bg-neutral-600"></span>
              <span className="block h-0.5 w-5 bg-neutral-600 mt-1.5"></span>
              <span className="block h-0.5 w-5 bg-neutral-600 mt-1.5"></span>
            </button>

            <div className="flex-1 text-center text-xl font-semibold text-neutral-900">
              پنل مدیریت
            </div>

            <div className="flex items-center space-x-2">
              <img
                src="/default-avatar.png"
                alt="تصویر کاربر"
                className="h-10 w-10 rounded-full"
              />
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-full px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
