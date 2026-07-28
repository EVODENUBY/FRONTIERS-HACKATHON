import React from 'react';
import { 
  Home, 
  MapPin, 
  FileText, 
  Settings, 
  ShieldCheck,
  User,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export type MainNavTab = 'dashboard' | 'site_analysis' | 'reports' | 'settings';

interface SidebarProps {
  activeTab: MainNavTab;
  onTabChange: (tab: MainNavTab) => void;
  reportCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  reportCount = 0,
}) => {
  const navItems = [
    { id: 'dashboard' as MainNavTab, label: 'Dashboard', icon: Home },
    { id: 'site_analysis' as MainNavTab, label: 'Site Analysis', icon: MapPin },
    { id: 'reports' as MainNavTab, label: 'Reports', icon: FileText, badge: reportCount > 0 ? reportCount : undefined },
    { id: 'settings' as MainNavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 select-none z-30 font-sans">
      {/* Top Header & Logo */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900 tracking-tight text-base leading-none">InfraMind AI</span>
            </div>
            <span className="text-[11px] text-gray-500 font-medium block mt-1">
              Safe Excavation Copilot
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick System Readiness Indicator */}
        <div className="mt-8 mx-1 p-3 bg-stone-50 border border-gray-200 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Engine Readiness
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <p className="text-[11px] text-gray-500 leading-normal">
            Gemini Vision & Spatial GIS models connected.
          </p>
        </div>
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-3 border-t border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-md">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
            PN
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-gray-900 truncate leading-tight">Eng. Patrick N.</h4>
            <p className="text-[11px] text-gray-500 truncate">Lead Site Engineer</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
