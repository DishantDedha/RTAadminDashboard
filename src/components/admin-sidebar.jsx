'use client';

import Image from 'next/image';
import { BarChart3, FileText, Users, Settings, ClipboardList, Calendar } from 'lucide-react';

export default function AdminSidebar({ activeMenu, setActiveMenu }) {
  const menuItems = [
    { name: 'Dashboard', icon: BarChart3, key: 'Dashboard' },
     { name: 'All Submissions', icon: FileText, key: 'All Submissions' },
    { name: 'ISR Forms Management', icon: ClipboardList, key: 'ISR-Forms-Management' },
   
    { name: 'Categories Management', icon: Users, key: 'Users' },
    { name: 'Events Management', icon: Calendar, key: 'Events-Management' },
    { name: 'Settings', icon: Settings, key: 'Settings' },
    
  ];

  return (
    <div className="w-72 bg-white border-r border-gray-200 p-4 hidden md:block overflow-y-auto h-screen">
      <div className="flex items-center gap-3 mb-8">
        <Image
          src="/logo.jpeg"
          alt="KFINTCH Logo"
          width={120}
          height={36}
          className="h-8 w-auto"
        />
        <span className="text-xl font-semibold text-dynamic">Admin Portal</span>
      </div>

      <nav className="space-y-1 text-sm">
        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => setActiveMenu(item.key)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors ${
              activeMenu === item.key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-dynamic'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="font-medium">{item.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}
