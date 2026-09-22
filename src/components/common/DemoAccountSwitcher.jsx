import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { UserCheck, Shield, User, UserX, Sparkles } from 'lucide-react';

export default function DemoAccountSwitcher() {
  const { user, isMember, isAdmin, switchDemoAccount } = useAuth();
  const { showToast, setCurrentView } = useStore();

  const handleSwitch = async (type) => {
    await switchDemoAccount(type);
    if (type === 'admin') {
      setCurrentView('admin');
      showToast('Switched to Store Admin Mode', 'success');
    } else if (type === 'member') {
      setCurrentView('home');
      showToast('Switched to Active Member (Special Member Prices Active)', 'success');
    } else if (type === 'regular') {
      setCurrentView('home');
      showToast('Switched to Normal Customer (Normal Prices Active)', 'info');
    } else {
      setCurrentView('home');
      showToast('Switched to Guest Browsing Mode', 'info');
    }
  };

  return (
    <div className="bg-[#111111] text-white border-b border-neutral-800 text-xs py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-[#D71920] text-white font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
            Live Preview Modes
          </span>
          <span className="text-neutral-400 hidden sm:inline">
            Current: <strong className="text-white">{user ? `${user.name} (${user.role === 'admin' ? 'Admin' : isMember ? '★ Member' : 'Normal Customer'})` : 'Guest Browsing'}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <button
            onClick={() => handleSwitch('guest')}
            className={`px-2 py-1 rounded text-xs transition flex items-center gap-1 ${
              !user ? 'bg-neutral-800 text-white font-bold ring-1 ring-neutral-500' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            Guest
          </button>

          <button
            onClick={() => handleSwitch('regular')}
            className={`px-2 py-1 rounded text-xs transition flex items-center gap-1 ${
              user && !isMember && !isAdmin ? 'bg-neutral-800 text-white font-bold ring-1 ring-neutral-500' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Normal Customer
          </button>

          <button
            onClick={() => handleSwitch('member')}
            className={`px-2 py-1 rounded text-xs transition flex items-center gap-1 ${
              user && isMember && !isAdmin ? 'bg-[#D71920] text-white font-bold ring-1 ring-red-400 shadow-sm' : 'text-red-400 hover:text-white hover:bg-red-950/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Active Member (₹ Save)
          </button>

          <button
            onClick={() => handleSwitch('admin')}
            className={`px-2 py-1 rounded text-xs transition flex items-center gap-1 ${
              isAdmin ? 'bg-neutral-700 text-white font-bold ring-1 ring-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin Portal
          </button>
        </div>
      </div>
    </div>
  );
}
