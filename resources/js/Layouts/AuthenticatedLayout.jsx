import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import TableDashboard from '@/Components/TableDashboard';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import { Menu, X } from "lucide-react";

export default function SidebarLayout({ title, children }) {
  const { props } = usePage();
  const user = props.auth?.user; // Pastikan user ada sebelum mengakses properti
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#EDF6FF]">
      {/* Sidebar for Desktop */}
      <aside className="hidden sm:flex sm:flex-col w-64 bg-[#34495E] border-r border-gray-200 p-5">
        <div className="flex items-center justify-center mb-6">
          <ApplicationLogo className="h-20 w-auto" />
        </div>
        <NavLink href={route('dashboard')} active={route().current('dashboard')}>
          Dashboard
        </NavLink>
        <NavLink href={route('create-survey')} active={route().current('create-survey')}>
          Create Survey
        </NavLink>
        <NavLink href={route('dashboard')}>Settings</NavLink>
      </aside>

      {/* Content Area with Header */}
      <div className="flex flex-col flex-1">
        {/* Top Navigation */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="sm:hidden text-gray-700">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Profile Dropdown */}
          <div className="hidden sm:flex sm:items-center w-full justify-between">
            <div>
          <h1 className="text-2xl font-bold text-[#34495E]">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
          <button className="relative p-2 border border-[#34495E] rounded-full bg-white hover:bg-gray-100">
            <img src="/assets/notif.svg" alt="Notification" className="w-7 h-7" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full"></span>
          </button>

            <Dropdown>
              <Dropdown.Trigger>
              <button
                type="button"
                className="flex items-center px-4 py-1 border border-[#34495E] rounded-xl bg-white hover:bg-gray-100"
              >
              <img src="/assets/profil.png" alt="User" className="w-10 h-10 rounded-full mr-2" />
                  {user ? user.name : 'Guest'}
                  <svg
                    className="ml-2 -mr-0.5 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </Dropdown.Trigger>

              <Dropdown.Content>
                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                <Dropdown.Link href={route('logout')} method="post" as="button">
                  Log Out
                </Dropdown.Link>
              </Dropdown.Content>
            </Dropdown>
            </div>
          </div>
        </div>

        {/* Sidebar for Mobile */}
        {isOpen && (
          <aside className="fixed inset-y-0 left-0 w-64 bg-blue-100 border-r border-gray-200 p-5 sm:hidden">
            <nav className="space-y-4">
              <Link href="/dashboard" className="block px-3 py-2 bg-white rounded-md hover:bg-gray-200">
                Dashboard
              </Link>
              <Link href="/my-survey" className="block px-3 py-2 bg-white rounded-md hover:bg-gray-200">
                My Survey
              </Link>
              <Link href="/settings" className="block px-3 py-2 bg-white rounded-md hover:bg-gray-200">
                Settings
              </Link>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
