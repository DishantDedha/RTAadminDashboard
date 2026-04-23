'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin-sidebar';
import AdminOverview from '@/components/admin-overview';
import AllSubmissions from '@/components/all-submissions';
import Users from '@/components/users';
import Settings from '@/components/settings';
import SubmissionsList from '@/components/submissions-list';
import CategoriesManagement from '@/components/categories-management';
import IsrFormsManagement from '@/components/isr-forms-management';
import EventsManagement from '@/components/events-management';

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-dynamic text-dynamic">
      <AdminSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <div className="flex-1 p-6 overflow-auto">
        {activeMenu === "Dashboard" && <AdminOverview />}
        {activeMenu === "ISR-Forms-Management" && <IsrFormsManagement />}
        {activeMenu === "All Submissions" && <SubmissionsList />}
        {activeMenu === "Users" && <CategoriesManagement />}
        {activeMenu === "Settings" && <Settings />}
        {activeMenu === "Events-Management" && <EventsManagement />}
      </div>
    </div>
  );
}
